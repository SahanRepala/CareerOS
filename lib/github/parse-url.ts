export interface ParsedRepo {
  owner: string;
  repo: string;
}

export interface ParseResult {
  data: ParsedRepo | null;
  error: string | null;
}

const GITHUB_HOSTS = new Set(['github.com', 'www.github.com']);

/**
 * Validates that a string is a well-formed GitHub repository URL and
 * extracts the `{owner, repo}` pair from it. Accepts full URLs with or
 * without a protocol (e.g. `github.com/vercel/next.js`) as well as
 * `owner/repo` shorthand.
 */
export function parseGitHubRepoUrl(input: string): ParseResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { data: null, error: 'Please enter a GitHub repository URL.' };
  }

  // Allow shorthand like "owner/repo".
  const shorthandMatch = trimmed.match(/^([a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38})\/([a-zA-Z0-9._-]+)$/);
  if (shorthandMatch) {
    const [, owner, repoRaw] = shorthandMatch;
    return { data: { owner, repo: stripGitSuffix(repoRaw) }, error: null };
  }

  let url: URL;
  try {
    url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
  } catch {
    return { data: null, error: 'That doesn\u2019t look like a valid URL.' };
  }

  if (!GITHUB_HOSTS.has(url.hostname.toLowerCase())) {
    return { data: null, error: 'Please enter a URL from github.com.' };
  }

  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length < 2) {
    return { data: null, error: 'The URL must point to a repository, e.g. github.com/owner/repo.' };
  }

  const [owner, repoRaw] = segments;
  const repo = stripGitSuffix(repoRaw);

  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38}$/.test(owner) || !/^[a-zA-Z0-9._-]+$/.test(repo)) {
    return { data: null, error: 'The repository owner or name contains invalid characters.' };
  }

  return { data: { owner, repo }, error: null };
}

function stripGitSuffix(repo: string): string {
  return repo.endsWith('.git') ? repo.slice(0, -4) : repo;
}
