import type { TechStackItem } from '@/lib/github/types';

/**
 * Maps well-known manifest / config file names to the tech-stack signal(s)
 * they imply. Matching is done against the basename of each file path found
 * in the repository tree, so files can live at any depth (root, `apps/web`,
 * etc.) and still be detected.
 */
const FILE_SIGNALS: Record<string, Omit<TechStackItem, 'id' | 'detectedFrom'>[]> = {
  'package.json': [{ label: 'Node.js', category: 'language' }],
  'requirements.txt': [{ label: 'Python', category: 'language' }],
  'pyproject.toml': [{ label: 'Python', category: 'language' }],
  pipfile: [{ label: 'Python', category: 'language' }],
  'go.mod': [{ label: 'Go', category: 'language' }],
  'cargo.toml': [{ label: 'Rust', category: 'language' }],
  gemfile: [{ label: 'Ruby', category: 'language' }],
  'composer.json': [{ label: 'PHP', category: 'language' }],
  'pom.xml': [{ label: 'Java (Maven)', category: 'package-manager' }],
  'build.gradle': [{ label: 'Java/Kotlin (Gradle)', category: 'package-manager' }],
  'build.gradle.kts': [{ label: 'Kotlin (Gradle)', category: 'package-manager' }],
  dockerfile: [{ label: 'Docker', category: 'infra' }],
  'docker-compose.yml': [{ label: 'Docker Compose', category: 'infra' }],
  'docker-compose.yaml': [{ label: 'Docker Compose', category: 'infra' }],
  'yarn.lock': [{ label: 'Yarn', category: 'package-manager' }],
  'pnpm-lock.yaml': [{ label: 'pnpm', category: 'package-manager' }],
  'package-lock.json': [{ label: 'npm', category: 'package-manager' }],
  'tsconfig.json': [{ label: 'TypeScript', category: 'language' }],
  'next.config.js': [{ label: 'Next.js', category: 'framework' }],
  'next.config.mjs': [{ label: 'Next.js', category: 'framework' }],
  'next.config.ts': [{ label: 'Next.js', category: 'framework' }],
  'nuxt.config.ts': [{ label: 'Nuxt', category: 'framework' }],
  'angular.json': [{ label: 'Angular', category: 'framework' }],
  'vue.config.js': [{ label: 'Vue', category: 'framework' }],
  'svelte.config.js': [{ label: 'Svelte', category: 'framework' }],
  'vite.config.ts': [{ label: 'Vite', category: 'tooling' }],
  'vite.config.js': [{ label: 'Vite', category: 'tooling' }],
  'tailwind.config.js': [{ label: 'Tailwind CSS', category: 'tooling' }],
  'tailwind.config.ts': [{ label: 'Tailwind CSS', category: 'tooling' }],
  'manage.py': [{ label: 'Django', category: 'framework' }],
  'artisan': [{ label: 'Laravel', category: 'framework' }],
  '.terraform-version': [{ label: 'Terraform', category: 'infra' }],
  'terraform.tf': [{ label: 'Terraform', category: 'infra' }],
  'serverless.yml': [{ label: 'Serverless Framework', category: 'infra' }],
  'kubernetes.yaml': [{ label: 'Kubernetes', category: 'infra' }],
  'helm.yaml': [{ label: 'Helm', category: 'infra' }],
  'chart.yaml': [{ label: 'Helm', category: 'infra' }],
};

const EXTENSION_SIGNALS: Record<string, Omit<TechStackItem, 'id' | 'detectedFrom'>> = {
  '.py': { label: 'Python', category: 'language' },
  '.rb': { label: 'Ruby', category: 'language' },
  '.go': { label: 'Go', category: 'language' },
  '.rs': { label: 'Rust', category: 'language' },
  '.java': { label: 'Java', category: 'language' },
  '.kt': { label: 'Kotlin', category: 'language' },
  '.ts': { label: 'TypeScript', category: 'language' },
  '.tsx': { label: 'TypeScript', category: 'language' },
  '.swift': { label: 'Swift', category: 'language' },
  '.php': { label: 'PHP', category: 'language' },
  '.cs': { label: 'C#', category: 'language' },
};

// Dependency-key -> framework label, checked against package.json dependencies.
const PACKAGE_JSON_FRAMEWORKS: Record<string, string> = {
  react: 'React',
  next: 'Next.js',
  vue: 'Vue',
  nuxt: 'Nuxt',
  '@angular/core': 'Angular',
  svelte: 'Svelte',
  express: 'Express',
  fastify: 'Fastify',
  '@nestjs/core': 'NestJS',
  electron: 'Electron',
  tailwindcss: 'Tailwind CSS',
};

export function detectTechStackFromPaths(paths: string[]): TechStackItem[] {
  const found = new Map<string, TechStackItem>();

  for (const path of paths) {
    const basename = path.split('/').pop()?.toLowerCase() ?? '';
    const signals = FILE_SIGNALS[basename];
    if (signals) {
      for (const signal of signals) {
        addSignal(found, signal, path);
      }
    }

    const extMatch = basename.match(/\.[a-z0-9]+$/);
    if (extMatch && EXTENSION_SIGNALS[extMatch[0]]) {
      addSignal(found, EXTENSION_SIGNALS[extMatch[0]], path);
    }
  }

  return Array.from(found.values()).sort((a, b) => a.label.localeCompare(b.label));
}

function addSignal(
  found: Map<string, TechStackItem>,
  signal: Omit<TechStackItem, 'id' | 'detectedFrom'>,
  detectedFrom: string
) {
  const id = signal.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (!found.has(id)) {
    found.set(id, { id, detectedFrom, ...signal });
  }
}

/** Adds framework signals inferred from a parsed package.json's dependency keys. */
export function detectFrameworksFromPackageJson(
  pkg: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> } | null
): TechStackItem[] {
  if (!pkg) return [];

  const allDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  const items: TechStackItem[] = [];

  for (const [dep, label] of Object.entries(PACKAGE_JSON_FRAMEWORKS)) {
    if (dep in allDeps) {
      const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      items.push({ id, label, category: 'framework', detectedFrom: 'package.json' });
    }
  }

  return items;
}
