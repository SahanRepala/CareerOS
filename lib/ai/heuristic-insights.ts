import type {
  AIInsights,
  ArchitectureLayer,
  EngineeringMaturityAssessment,
  QualitativeAssessment,
  RankedImprovement,
  RepoMetadata,
  RepoScoreBreakdown,
  RepoSignals,
  TechStackItem,
} from '@/lib/github/types';

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function labelsIn(techStack: TechStackItem[], category: TechStackItem['category']): string[] {
  return techStack.filter((t) => t.category === category).map((t) => t.label);
}

function buildArchitecture(metadata: RepoMetadata, techStack: TechStackItem[]): ArchitectureLayer[] {
  const frameworks = labelsIn(techStack, 'framework');
  const languages = labelsIn(techStack, 'language');
  const infra = labelsIn(techStack, 'infra');

  const frontendFrameworks = frameworks.filter((f) =>
    ['React', 'Next.js', 'Vue', 'Nuxt', 'Angular', 'Svelte'].includes(f)
  );
  const backendFrameworks = frameworks.filter((f) =>
    ['Express', 'Fastify', 'NestJS', 'Django', 'Laravel'].includes(f)
  );
  const hasDb =
    techStack.some((t) => /sql|mongo|redis|prisma|sequelize|supabase/i.test(t.label)) ||
    metadata.description?.match(/database|postgres|mongo|mysql/i);

  return [
    {
      layer: 'frontend',
      detected: frontendFrameworks.length > 0,
      summary:
        frontendFrameworks.length > 0
          ? `Built with ${frontendFrameworks.join(', ')}.`
          : languages.includes('TypeScript') || languages.includes('Node.js')
            ? 'No dedicated frontend framework detected — likely a backend-only or CLI project.'
            : 'No frontend layer detected from the repository structure.',
    },
    {
      layer: 'backend',
      detected: backendFrameworks.length > 0 || infra.length > 0,
      summary:
        backendFrameworks.length > 0
          ? `Server-side logic built with ${backendFrameworks.join(', ')}.`
          : 'No standalone backend framework detected — the app may rely on managed backend services.',
    },
    {
      layer: 'database',
      detected: !!hasDb,
      summary: hasDb
        ? 'References to a database or ORM layer were found in the repository.'
        : 'No explicit database layer detected from dependencies or file structure.',
    },
    {
      layer: 'apis',
      detected: backendFrameworks.length > 0 || frontendFrameworks.includes('Next.js'),
      summary:
        backendFrameworks.length > 0 || frontendFrameworks.includes('Next.js')
          ? 'The project structure suggests API routes or endpoints are exposed by the app framework.'
          : 'No clear API layer was identified.',
    },
    {
      layer: 'authentication',
      detected:
        techStack.some((t) => /auth|supabase|firebase|passport|oauth|clerk|next-auth/i.test(t.label)) ||
        !!metadata.description?.match(/auth/i),
      summary: techStack.some((t) => /auth|supabase|firebase|passport|oauth|clerk|next-auth/i.test(t.label))
        ? 'Authentication-related dependencies were detected in the manifest.'
        : 'No authentication provider or library was detected.',
    },
    {
      layer: 'deployment',
      detected: infra.length > 0,
      summary:
        infra.length > 0
          ? `Deployment tooling detected: ${infra.join(', ')}.`
          : 'No containerization or infrastructure-as-code files were detected.',
    },
  ];
}

function buildScores(signals: RepoSignals, techStack: TechStackItem[], metadata: RepoMetadata): RepoScoreBreakdown {
  const layeredSignals = techStack.length;

  const architecture = clamp(
    45 + Math.min(layeredSignals * 4, 35) + (signals.hasTypeScript ? 10 : 0) + (metadata.topics.length > 0 ? 10 : 0)
  );

  const maintainability = clamp(
    40 +
      (signals.hasLinting ? 20 : 0) +
      (signals.hasFormatting ? 10 : 0) +
      (signals.hasTypeScript ? 15 : 0) +
      (signals.hasCI ? 10 : 0) +
      (metadata.isArchived ? -20 : 0)
  );

  const documentation = clamp(
    20 +
      (signals.hasReadme ? 40 : 0) +
      (signals.hasContributingGuide ? 15 : 0) +
      (metadata.description ? 15 : 0) +
      (metadata.topics.length > 0 ? 10 : 0)
  );

  const security = clamp(
    45 +
      (signals.hasEnvExample ? 20 : 0) +
      (signals.hasLicense ? 10 : 0) +
      (signals.hasCI ? 15 : 0) +
      (metadata.isPrivate ? 5 : 0)
  );

  const testing = clamp(
    15 + (signals.hasTests ? 55 : 0) + Math.min(signals.testFrameworks.length * 10, 20) + (signals.hasCI ? 10 : 0)
  );

  const overall = clamp((architecture + maintainability + documentation + security + testing) / 5);

  return { architecture, maintainability, documentation, security, testing, overall };
}

function buildMissingPractices(signals: RepoSignals): string[] {
  const missing: string[] = [];
  if (!signals.hasReadme) missing.push('No README file — new contributors have nothing to orient them.');
  if (!signals.hasTests) missing.push('No automated test suite was detected.');
  if (!signals.hasCI) missing.push('No CI pipeline (GitHub Actions, CircleCI, etc.) was detected.');
  if (!signals.hasDocker) missing.push('No Dockerfile — environment setup likely isn\u2019t containerized.');
  if (!signals.hasLinting) missing.push('No linter configuration was found.');
  if (!signals.hasFormatting) missing.push('No code formatter configuration (Prettier, EditorConfig) was found.');
  if (!signals.hasLicense) missing.push('No LICENSE file — usage terms are unclear.');
  if (!signals.hasEnvExample) missing.push('No `.env.example` — required environment variables aren\u2019t documented.');
  if (!signals.hasContributingGuide) missing.push('No CONTRIBUTING guide for external contributors.');
  return missing;
}

function buildStrengths(signals: RepoSignals, techStack: TechStackItem[], metadata: RepoMetadata): string[] {
  const strengths: string[] = [];
  if (signals.hasReadme) strengths.push('Documented with a README for onboarding.');
  if (signals.hasTests) strengths.push(`Automated tests in place${signals.testFrameworks.length ? ` (${signals.testFrameworks.join(', ')})` : ''}.`);
  if (signals.hasCI) strengths.push(`Continuous integration configured${signals.ciProviders.length ? ` via ${signals.ciProviders.join(', ')}` : ''}.`);
  if (signals.hasTypeScript) strengths.push('Uses TypeScript for stronger type safety.');
  if (signals.hasDocker) strengths.push('Containerized with Docker for reproducible environments.');
  if (metadata.stars > 10) strengths.push(`Community traction with ${metadata.stars.toLocaleString()} stars.`);
  if (techStack.some((t) => t.category === 'framework')) strengths.push('Built on an established, well-supported framework.');
  if (strengths.length === 0) strengths.push('Repository is small and focused, which keeps it easy to reason about.');
  return strengths;
}

function buildWeaknesses(signals: RepoSignals, metadata: RepoMetadata): string[] {
  const weaknesses: string[] = [];
  if (!signals.hasTests) weaknesses.push('Lack of automated tests increases regression risk.');
  if (!signals.hasCI) weaknesses.push('No CI pipeline means checks aren\u2019t enforced automatically before merges.');
  if (!signals.hasReadme) weaknesses.push('Missing documentation makes onboarding harder for new contributors.');
  if (!signals.hasLinting) weaknesses.push('No linting configured, so style and common bugs may go uncaught.');
  if (metadata.openIssues > 20) weaknesses.push(`A backlog of ${metadata.openIssues} open issues suggests maintenance is lagging.`);
  if (metadata.isArchived) weaknesses.push('Repository is archived and no longer actively maintained.');
  if (weaknesses.length === 0) weaknesses.push('No major weaknesses stood out from the repository structure alone.');
  return weaknesses;
}

function buildCodeQuality(signals: RepoSignals): string[] {
  const notes: string[] = [];
  notes.push(
    signals.hasTypeScript
      ? 'Static typing is in place, which tends to reduce runtime type errors.'
      : 'No static type system detected — refactors carry more risk without compiler checks.'
  );
  notes.push(
    signals.hasLinting && signals.hasFormatting
      ? 'Linting and formatting are both configured, suggesting consistent code style is enforced.'
      : 'Code style enforcement (lint/format) is partially or fully absent.'
  );
  notes.push(
    signals.hasTests
      ? 'Presence of a test suite suggests at least some behavior is verified automatically.'
      : 'Without tests, code quality currently relies on manual review alone.'
  );
  return notes;
}

function buildSuggestions(signals: RepoSignals): string[] {
  const suggestions: string[] = [];
  if (!signals.hasTests) suggestions.push('Add a test suite (unit tests first) starting with the most critical modules.');
  if (!signals.hasCI) suggestions.push('Set up a CI workflow to run lint/tests automatically on every pull request.');
  if (!signals.hasReadme) suggestions.push('Write a README covering setup, usage, and architecture.');
  if (!signals.hasDocker) suggestions.push('Add a Dockerfile to make local setup and deployment reproducible.');
  if (!signals.hasLinting) suggestions.push('Introduce a linter (ESLint, Ruff, RuboCop, etc.) to catch issues early.');
  if (!signals.hasEnvExample) suggestions.push('Add a `.env.example` documenting required environment variables.');
  if (!signals.hasLicense) suggestions.push('Add a LICENSE file to clarify how others can use the code.');
  if (suggestions.length === 0) suggestions.push('Keep dependencies up to date and continue expanding test coverage.');
  return suggestions;
}

function buildRecruiterImpression(scores: RepoScoreBreakdown, signals: RepoSignals): string {
  if (scores.overall >= 80) {
    return 'This repository would likely make a strong impression on recruiters: it reflects mature engineering practices such as testing, CI, and documentation.';
  }
  if (scores.overall >= 60) {
    return 'This repository would read as solid, working project — recruiters would likely see clear effort, though a few missing practices (like tests or CI) stand out.';
  }
  return `This repository would likely come across as an early-stage or personal project to a recruiter${
    !signals.hasReadme ? ', particularly since it lacks a README to explain the project quickly' : ''
  }.`;
}

function buildResumeBullets(metadata: RepoMetadata, techStack: TechStackItem[], signals: RepoSignals): string[] {
  const stack = techStack
    .slice(0, 4)
    .map((t) => t.label)
    .join(', ');
  const bullets: string[] = [];

  bullets.push(
    `Built ${metadata.name}${stack ? `, a project using ${stack}` : ''}${
      metadata.description ? ` to ${metadata.description.replace(/\.$/, '').toLowerCase()}` : ''
    }.`
  );
  if (signals.hasTests) {
    bullets.push(`Implemented automated tests${signals.testFrameworks.length ? ` with ${signals.testFrameworks.join(', ')}` : ''} to guard against regressions.`);
  }
  if (signals.hasCI) {
    bullets.push(`Configured CI${signals.ciProviders.length ? ` via ${signals.ciProviders.join(', ')}` : ''} to automate quality checks on every change.`);
  }
  if (signals.hasDocker) {
    bullets.push('Containerized the application with Docker for consistent local and production environments.');
  }
  if (metadata.stars > 0) {
    bullets.push(`Grew the project to ${metadata.stars.toLocaleString()} GitHub stars and ${metadata.forks.toLocaleString()} forks.`);
  }
  return bullets.slice(0, 5);
}

function buildEngineeringMaturity(
  scores: RepoScoreBreakdown,
  signals: RepoSignals,
  techStack: TechStackItem[]
): EngineeringMaturityAssessment {
  const practiceCount = [
    signals.hasTests,
    signals.hasCI,
    signals.hasLinting,
    signals.hasFormatting,
    signals.hasTypeScript,
    signals.hasDocker,
    signals.hasEnvExample,
  ].filter(Boolean).length;

  if (scores.overall >= 70 && practiceCount >= 5) {
    return {
      level: 'Advanced',
      reasoning: `${practiceCount} of 7 core engineering practices were detected (tests, CI, linting, formatting, typing, containerization, env config), indicating a mature, production-minded workflow.`,
    };
  }

  if (scores.overall >= 45 && practiceCount >= 2) {
    return {
      level: 'Intermediate',
      reasoning: `${practiceCount} of 7 core engineering practices were detected. The project shows working structure and some quality tooling${
        techStack.some((t) => t.category === 'framework') ? ', built on an established framework,' : ''
      } but is missing enough practices to be considered fully mature.`,
    };
  }

  return {
    level: 'Beginner',
    reasoning: `Only ${practiceCount} of 7 core engineering practices (tests, CI, linting, formatting, typing, containerization, env config) were detected, consistent with an early-stage or learning project.`,
  };
}

function buildArchitectureQuality(architecture: ArchitectureLayer[], scores: RepoScoreBreakdown): QualitativeAssessment {
  const detectedCount = architecture.filter((a) => a.detected).length;
  const rating = scores.architecture >= 75 ? 'Strong' : scores.architecture >= 50 ? 'Moderate' : 'Basic';
  return {
    rating,
    reasoning: `${detectedCount} of ${architecture.length} architecture layers (${architecture
      .filter((a) => a.detected)
      .map((a) => a.layer)
      .join(', ') || 'none'}) were clearly identifiable from the repository structure, which is the basis for this rating.`,
  };
}

function buildScalabilityAssessment(signals: RepoSignals, techStack: TechStackItem[], architecture: ArchitectureLayer[]): QualitativeAssessment {
  const hasInfra = techStack.some((t) => t.category === 'infra');
  const hasDb = architecture.find((a) => a.layer === 'database')?.detected ?? false;
  const hasApiLayer = architecture.find((a) => a.layer === 'apis')?.detected ?? false;
  const signalCount = [hasInfra, hasDb, hasApiLayer, signals.hasDocker, signals.hasIaC].filter(Boolean).length;

  const rating = signalCount >= 4 ? 'High' : signalCount >= 2 ? 'Moderate' : 'Low';
  const evidence = [
    hasDb && 'a database layer',
    hasApiLayer && 'a defined API layer',
    signals.hasDocker && 'containerization',
    signals.hasIaC && 'infrastructure-as-code',
    hasInfra && 'deployment infra',
  ].filter(Boolean);

  return {
    rating,
    reasoning:
      evidence.length > 0
        ? `Detected ${evidence.join(', ')}, which are the structural building blocks that typically allow a system to scale beyond a single-instance setup.`
        : 'No infrastructure, database separation, or IaC signals were detected, so there is no evidence the project has been designed to scale beyond local/single-instance use.',
  };
}

function buildMaintainabilityAssessment(scores: RepoScoreBreakdown, signals: RepoSignals): QualitativeAssessment {
  const rating = scores.maintainability >= 75 ? 'High' : scores.maintainability >= 45 ? 'Moderate' : 'Low';
  const supporting = [
    signals.hasTypeScript && 'static typing',
    signals.hasLinting && 'linting',
    signals.hasFormatting && 'formatting rules',
    signals.hasCI && 'CI enforcement',
  ].filter(Boolean);
  const missing = [
    !signals.hasTypeScript && 'static typing',
    !signals.hasLinting && 'linting',
    !signals.hasTests && 'automated tests',
  ].filter(Boolean);

  return {
    rating,
    reasoning:
      supporting.length > 0
        ? `${supporting.join(', ')} help keep future changes safe and consistent.${
            missing.length ? ` Missing ${missing.join(', ')} would still make larger refactors riskier.` : ''
          }`
        : `No maintainability safeguards (${missing.join(', ')}) were detected, so future changes carry more risk than they would with typing, linting, and tests in place.`,
  };
}

function buildSecurityObservations(signals: RepoSignals, metadata: RepoMetadata): string[] {
  const observations: string[] = [];
  observations.push(
    signals.hasEnvExample
      ? 'A `.env.example` file is present, suggesting secrets are meant to be kept out of version control.'
      : 'No `.env.example` was found, so it isn\u2019t possible to confirm how (or whether) secrets/config are kept out of version control.'
  );
  observations.push(
    signals.hasLicense
      ? `A ${metadata.license ?? ''} license file clarifies usage terms.`.replace('  ', ' ')
      : 'No LICENSE file was found, leaving usage and distribution terms unclear.'
  );
  observations.push(
    signals.hasCI
      ? 'CI is configured, which can be extended to run dependency/security scanning, though none was directly confirmed.'
      : 'No CI pipeline was detected, so there is no evidence of automated dependency or security scanning.'
  );
  if (metadata.isPrivate) {
    observations.push('The repository is private, limiting public exposure of its source.');
  }
  return observations;
}

function buildProductionReadiness(scores: RepoScoreBreakdown, signals: RepoSignals, metadata: RepoMetadata): QualitativeAssessment {
  const blockers = [
    !signals.hasTests && 'no automated tests',
    !signals.hasCI && 'no CI pipeline',
    !signals.hasEnvExample && 'no documented environment configuration',
    metadata.isArchived && 'the repository is archived',
  ].filter(Boolean) as string[];

  const rating = scores.overall >= 75 && blockers.length === 0 ? 'Ready' : scores.overall >= 50 ? 'Nearing readiness' : 'Not yet ready';

  return {
    rating,
    reasoning:
      blockers.length > 0
        ? `Key gaps before this could run reliably in production: ${blockers.join(', ')}.`
        : 'Core production signals (tests, CI, environment configuration) are present, with no major gaps detected from the repository structure.',
  };
}

function buildInterviewQuestions(techStack: TechStackItem[], architecture: ArchitectureLayer[], signals: RepoSignals): string[] {
  const questions: string[] = [];
  const frameworks = techStack.filter((t) => t.category === 'framework').map((t) => t.label);
  const languages = techStack.filter((t) => t.category === 'language').map((t) => t.label);

  if (frameworks.length > 0) {
    questions.push(`Walk me through how you structured this project with ${frameworks[0]} — what would you change if you rebuilt it today?`);
  }
  if (architecture.find((a) => a.layer === 'database')?.detected) {
    questions.push('How is data modeled in this project, and how would the schema need to evolve to support 10x the current data volume?');
  }
  if (architecture.find((a) => a.layer === 'authentication')?.detected) {
    questions.push('Walk me through the authentication flow — how are sessions/tokens managed and what would you do differently for higher security requirements?');
  }
  if (architecture.find((a) => a.layer === 'apis')?.detected) {
    questions.push('How are the API endpoints in this project versioned and protected against misuse (rate limiting, validation, etc.)?');
  }
  if (signals.hasTests) {
    questions.push(`You have ${signals.testFrameworks.join('/') || 'a test suite'} in place — what's your strategy for deciding what to test versus what to leave uncovered?`);
  } else {
    questions.push('This project doesn\u2019t have automated tests yet — how would you prioritize adding coverage, and where would you start?');
  }
  if (languages.includes('TypeScript') || languages.includes('Java') || languages.includes('C#')) {
    questions.push(`How does static typing in ${languages[0]} change the way you approach refactoring compared to a dynamically typed language?`);
  }
  if (signals.hasCI) {
    questions.push('Walk me through your CI pipeline — what runs on every PR, and what would you add next?');
  }
  if (questions.length === 0) {
    questions.push('Walk me through the overall structure of this project and the reasoning behind your key technical decisions.');
  }
  return questions.slice(0, 6);
}

function buildTopImprovements(signals: RepoSignals, scores: RepoScoreBreakdown, metadata: RepoMetadata): RankedImprovement[] {
  const candidates: { title: string; impact: string; weight: number }[] = [];

  if (!signals.hasTests) {
    candidates.push({
      title: 'Add an automated test suite',
      impact: 'Directly raises the testing and maintainability scores and is usually the single biggest credibility signal for recruiters and interviewers.',
      weight: 100 - scores.testing,
    });
  }
  if (!signals.hasCI) {
    candidates.push({
      title: 'Set up a CI pipeline',
      impact: 'Automatically enforces quality checks on every change and demonstrates production-oriented workflow habits.',
      weight: 90 - scores.maintainability,
    });
  }
  if (!signals.hasReadme) {
    candidates.push({
      title: 'Write a proper README',
      impact: 'Improves first impressions for recruiters and contributors, who typically decide relevance within seconds of opening the repo.',
      weight: 95 - scores.documentation,
    });
  }
  if (!signals.hasLinting) {
    candidates.push({
      title: 'Add linting configuration',
      impact: 'Catches bugs and style issues automatically, improving code quality score and review efficiency.',
      weight: 60 - scores.maintainability,
    });
  }
  if (!signals.hasDocker) {
    candidates.push({
      title: 'Add a Dockerfile',
      impact: 'Makes environment setup reproducible, which supports both scalability and production-readiness.',
      weight: 55,
    });
  }
  if (!signals.hasEnvExample) {
    candidates.push({
      title: 'Add a `.env.example` file',
      impact: 'Documents required configuration and is a low-effort, high-clarity fix for security and onboarding.',
      weight: 50 - scores.security,
    });
  }
  if (!signals.hasLicense) {
    candidates.push({
      title: 'Add a LICENSE file',
      impact: 'Clarifies legal usage terms, which matters if the repository is public or intended to attract collaborators.',
      weight: 40,
    });
  }
  if (metadata.openIssues > 20) {
    candidates.push({
      title: 'Triage the open-issue backlog',
      impact: 'A shrinking, well-labeled backlog signals active maintenance rather than an abandoned project.',
      weight: 45,
    });
  }
  if (!signals.hasFormatting) {
    candidates.push({
      title: 'Add a code formatter (Prettier/EditorConfig)',
      impact: 'Removes style debates and keeps diffs focused on logic, a small but visible maintainability win.',
      weight: 30,
    });
  }
  if (candidates.length === 0) {
    candidates.push({
      title: 'Expand test coverage and monitoring',
      impact: 'With the core practices already in place, deeper test coverage and observability are the next biggest levers for production confidence.',
      weight: 20,
    });
  }

  return candidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map((c, i) => ({ priority: i + 1, title: c.title, impact: c.impact }));
}

/**
 * Deterministic fallback that produces a full `AIInsights` object from repo
 * signals alone, with no LLM call. Used when no API key is configured or the
 * AI call fails, so the feature always returns something useful.
 */
export function generateHeuristicInsights(
  metadata: RepoMetadata,
  techStack: TechStackItem[],
  signals: RepoSignals
): AIInsights {
  const scores = buildScores(signals, techStack, metadata);
  const architecture = buildArchitecture(metadata, techStack);

  return {
    source: 'heuristic',
    summary: `${metadata.name} is a ${metadata.language ?? 'multi-language'} project${
      metadata.description ? ` that ${metadata.description.replace(/\.$/, '').toLowerCase()}` : ''
    }. It has ${metadata.stars.toLocaleString()} stars and was last pushed on ${new Date(
      metadata.pushedAt
    ).toLocaleDateString()}.`,
    architecture,
    strengths: buildStrengths(signals, techStack, metadata),
    weaknesses: buildWeaknesses(signals, metadata),
    codeQuality: buildCodeQuality(signals),
    missingPractices: buildMissingPractices(signals),
    scores,
    suggestions: buildSuggestions(signals),
    recruiterImpression: buildRecruiterImpression(scores, signals),
    resumeBullets: buildResumeBullets(metadata, techStack, signals),
    engineeringMaturity: buildEngineeringMaturity(scores, signals, techStack),
    architectureQuality: buildArchitectureQuality(architecture, scores),
    scalabilityAssessment: buildScalabilityAssessment(signals, techStack, architecture),
    maintainabilityAssessment: buildMaintainabilityAssessment(scores, signals),
    securityObservations: buildSecurityObservations(signals, metadata),
    productionReadiness: buildProductionReadiness(scores, signals, metadata),
    interviewQuestions: buildInterviewQuestions(techStack, architecture, signals),
    topImprovements: buildTopImprovements(signals, scores, metadata),
  };
}
