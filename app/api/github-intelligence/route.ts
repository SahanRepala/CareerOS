import { NextResponse } from 'next/server';
import { parseGitHubRepoUrl } from '@/lib/github/parse-url';
import { buildFolderTree, type GitTreeEntry } from '@/lib/github/build-tree';
import { detectFrameworksFromPackageJson, detectTechStackFromPaths } from '@/lib/github/tech-stack';
import { detectRepoSignals } from '@/lib/github/repo-signals';
import { generateRepoInsights } from '@/lib/ai/github-insights';
import { generateHeuristicInsights } from '@/lib/ai/heuristic-insights';
import type { RepoAnalysis, RepoMetadata, RepoSignals, TechStackItem } from '@/lib/github/types';

export const dynamic = 'force-dynamic';

const GITHUB_API = 'https://api.github.com';
const MAX_TREE_ENTRIES = 2000;

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function POST(request: Request) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = parseGitHubRepoUrl(body.url ?? '');
  if (parsed.error || !parsed.data) {
    return NextResponse.json({ error: parsed.error ?? 'Invalid GitHub URL.' }, { status: 400 });
  }

  const { owner, repo } = parsed.data;

  try {
    const repoRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers: githubHeaders(),
      cache: 'no-store',
    });

    if (repoRes.status === 404) {
      return NextResponse.json(
        { error: `Repository "${owner}/${repo}" was not found. It may be private or misspelled.` },
        { status: 404 }
      );
    }

    if (repoRes.status === 403) {
      const remaining = repoRes.headers.get('x-ratelimit-remaining');
      if (remaining === '0') {
        return NextResponse.json(
          { error: 'GitHub API rate limit reached. Please try again in a few minutes.' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: 'GitHub declined this request. The repository may be restricted.' },
        { status: 403 }
      );
    }

    if (!repoRes.ok) {
      return NextResponse.json(
        { error: `GitHub API returned an unexpected error (${repoRes.status}).` },
        { status: 502 }
      );
    }

    const repoJson = await repoRes.json();

    const metadata: RepoMetadata = {
      name: repoJson.name,
      fullName: repoJson.full_name,
      owner: {
        login: repoJson.owner?.login ?? owner,
        avatarUrl: repoJson.owner?.avatar_url ?? '',
        htmlUrl: repoJson.owner?.html_url ?? '',
      },
      description: repoJson.description,
      htmlUrl: repoJson.html_url,
      homepage: repoJson.homepage || null,
      stars: repoJson.stargazers_count ?? 0,
      forks: repoJson.forks_count ?? 0,
      watchers: repoJson.subscribers_count ?? repoJson.watchers_count ?? 0,
      openIssues: repoJson.open_issues_count ?? 0,
      language: repoJson.language,
      license: repoJson.license?.spdx_id ?? repoJson.license?.name ?? null,
      defaultBranch: repoJson.default_branch ?? 'main',
      topics: repoJson.topics ?? [],
      isPrivate: !!repoJson.private,
      isArchived: !!repoJson.archived,
      isFork: !!repoJson.fork,
      createdAt: repoJson.created_at,
      updatedAt: repoJson.updated_at,
      pushedAt: repoJson.pushed_at,
      sizeKb: repoJson.size ?? 0,
    };

    // Folder structure + tech-stack detection, best-effort: a private/empty
    // repo or a tree fetch failure shouldn't block showing the metadata.
    let tree: ReturnType<typeof buildFolderTree> = [];
    let techStack: TechStackItem[] = [];
    let truncated = false;
    let fileCount = 0;
    let signals: RepoSignals = detectRepoSignals([]);

    try {
      const treeRes = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${metadata.defaultBranch}?recursive=1`,
        { headers: githubHeaders(), cache: 'no-store' }
      );

      if (treeRes.ok) {
        const treeJson = await treeRes.json();
        const entries: GitTreeEntry[] = (treeJson.tree ?? []).slice(0, MAX_TREE_ENTRIES);
        truncated = !!treeJson.truncated || (treeJson.tree ?? []).length > MAX_TREE_ENTRIES;
        fileCount = entries.filter((e: GitTreeEntry) => e.type === 'blob').length;

        tree = buildFolderTree(entries);
        techStack = detectTechStackFromPaths(entries.map((e) => e.path));
        signals = detectRepoSignals(entries.map((e) => e.path));

        const pkgEntry = entries.find((e) => e.path === 'package.json');
        if (pkgEntry) {
          const pkgContent = await fetchFileContent(owner, repo, 'package.json');
          const frameworks = detectFrameworksFromPackageJson(pkgContent);
          for (const fw of frameworks) {
            if (!techStack.some((t) => t.id === fw.id)) techStack.push(fw);
          }
        }
      }
    } catch {
      // Ignore tree/tech-stack failures — metadata alone is still useful.
    }

    techStack = techStack.sort((a, b) => a.label.localeCompare(b.label));

    // AI reasoning layer: summary, architecture, scores, suggestions, etc.
    // Reuses the metadata/tech-stack/signals already fetched above — the AI
    // call is used purely for reasoning over these facts, never to re-fetch
    // GitHub data. Falls back to a deterministic heuristic on any failure
    // so the module always returns a complete analysis.
    const insights = await generateRepoInsights(metadata, techStack, signals, tree).catch(() =>
      generateHeuristicInsights(metadata, techStack, signals)
    );

    const analysis: RepoAnalysis = {
      metadata,
      techStack,
      tree,
      truncated,
      fileCount,
      signals,
      insights,
    };

    return NextResponse.json(analysis satisfies RepoAnalysis);
  } catch {
    return NextResponse.json(
      { error: 'Could not reach the GitHub API. Please check your connection and try again.' },
      { status: 502 }
    );
  }
}

async function fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
      headers: githubHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.content) return null;
    const decoded = Buffer.from(json.content, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
