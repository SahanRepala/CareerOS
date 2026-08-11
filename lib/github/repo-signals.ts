import type { RepoSignals } from '@/lib/github/types';

/**
 * Scans the flat list of repository file paths for well-known markers of
 * engineering best practices (tests, CI, Docker, linting, docs, etc).
 * These are cheap, deterministic facts about the repo — the AI reasoning
 * layer is given this as ground truth instead of guessing at it.
 */
export function detectRepoSignals(paths: string[]): RepoSignals {
  const lower = paths.map((p) => p.toLowerCase());
  const basenames = lower.map((p) => p.split('/').pop() ?? '');

  const hasAny = (patterns: RegExp[]) => lower.some((p) => patterns.some((re) => re.test(p)));
  const basenameIs = (names: string[]) => basenames.some((b) => names.includes(b));

  const hasReadme = basenames.some((b) => /^readme(\.md|\.rst|\.txt)?$/.test(b));
  const hasLicense = basenames.some((b) => /^license(\.md|\.txt)?$/.test(b) || b === 'copying');
  const hasContributingGuide = basenames.some((b) =>
    /^(contributing|code_of_conduct)(\.md)?$/.test(b)
  );

  const hasTests = hasAny([
    /(^|\/)__tests__\//,
    /(^|\/)tests?\//,
    /\.test\.[jt]sx?$/,
    /\.spec\.[jt]sx?$/,
    /(^|\/)cypress\//,
    /(^|\/)jest\.config/,
    /(^|\/)vitest\.config/,
    /(^|\/)pytest\.ini$/,
    /(^|\/)phpunit\.xml$/,
  ]);
  const testFrameworks = [
    { id: 'Jest', re: /jest\.config/ },
    { id: 'Vitest', re: /vitest\.config/ },
    { id: 'Cypress', re: /(^|\/)cypress\// },
    { id: 'Playwright', re: /playwright\.config/ },
    { id: 'Pytest', re: /pytest\.ini$/ },
    { id: 'PHPUnit', re: /phpunit\.xml$/ },
    { id: 'RSpec', re: /(^|\/)spec\/.*_spec\.rb$/ },
  ]
    .filter((f) => lower.some((p) => f.re.test(p)))
    .map((f) => f.id);

  const hasCI = hasAny([
    /(^|\/)\.github\/workflows\/.+\.ya?ml$/,
    /(^|\/)\.gitlab-ci\.ya?ml$/,
    /(^|\/)\.circleci\/config\.ya?ml$/,
    /(^|\/)azure-pipelines\.ya?ml$/,
    /(^|\/)jenkinsfile$/,
    /(^|\/)\.travis\.ya?ml$/,
  ]);
  const ciProviders = [
    { id: 'GitHub Actions', re: /(^|\/)\.github\/workflows\// },
    { id: 'GitLab CI', re: /(^|\/)\.gitlab-ci\.ya?ml$/ },
    { id: 'CircleCI', re: /(^|\/)\.circleci\// },
    { id: 'Azure Pipelines', re: /(^|\/)azure-pipelines\.ya?ml$/ },
    { id: 'Jenkins', re: /(^|\/)jenkinsfile$/ },
    { id: 'Travis CI', re: /(^|\/)\.travis\.ya?ml$/ },
  ]
    .filter((c) => lower.some((p) => c.re.test(p)))
    .map((c) => c.id);

  const hasDocker = basenameIs(['dockerfile']) || hasAny([/docker-compose\.ya?ml$/]);
  const hasIaC = hasAny([
    /\.tf$/,
    /(^|\/)serverless\.ya?ml$/,
    /(^|\/)helm\//,
    /(^|\/)chart\.ya?ml$/,
    /(^|\/)kubernetes\//,
    /(^|\/)k8s\//,
  ]);

  const hasLinting = basenames.some(
    (b) => /^\.eslintrc/.test(b) || /^eslint\.config/.test(b) || b === '.flake8' || b === '.pylintrc' || b === 'ruff.toml' || b === '.rubocop.yml'
  );
  const hasFormatting = basenames.some((b) => /^\.prettierrc/.test(b) || b === '.editorconfig');
  const hasTypeScript = basenames.includes('tsconfig.json');
  const hasEnvExample = basenames.some((b) => /^\.env\.(example|sample|template)$/.test(b));

  return {
    hasReadme,
    hasLicense,
    hasTests,
    hasCI,
    hasDocker,
    hasLinting,
    hasFormatting,
    hasTypeScript,
    hasEnvExample,
    hasContributingGuide,
    hasIaC,
    testFrameworks,
    ciProviders,
  };
}
