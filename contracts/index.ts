/**
 * contracts/index.ts
 *
 * Single import point for every domain contract. Agents, workflows, the
 * orchestrator, and report-builders should import from '@/contracts'
 * rather than reaching into contracts/domain/* directly, so a contract can
 * be split or renamed without touching every consumer.
 */
export * from './agent.contract';
export * from './domain/resume.contract';
export * from './domain/job-description.contract';
export * from './domain/ats-report.contract';
export * from './domain/cover-letter.contract';
export * from './domain/interview.contract';
export * from './domain/github-report.contract';
export * from './domain/portfolio-report.contract';
export * from './domain/career-report.contract';
export * from './final-report.contract';
