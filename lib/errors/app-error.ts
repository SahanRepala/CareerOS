/**
 * lib/errors/app-error.ts
 *
 * One error shape for the whole AI layer. `AgentError` (contracts) and
 * `OrchestratorError` (orchestrator) are narrower, code-specific shapes used
 * internally; `AppError` is what an /api route should catch and serialize,
 * so the frontend always sees the same { code, message, details } envelope
 * regardless of which layer failed.
 */

export type AppErrorCode =
  | 'AGENT_TIMEOUT'
  | 'VALIDATION_ERROR'
  | 'WORKFLOW_ERROR'
  | 'PARSING_ERROR'
  | 'PROVIDER_ERROR'
  | 'NOT_IMPLEMENTED'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly details?: Record<string, unknown>;
  readonly httpStatus: number;

  constructor(code: AppErrorCode, message: string, options?: { details?: Record<string, unknown>; httpStatus?: number }) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = options?.details;
    this.httpStatus = options?.httpStatus ?? defaultHttpStatus(code);
  }

  toJSON() {
    return { error: { code: this.code, message: this.message, details: this.details } };
  }
}

function defaultHttpStatus(code: AppErrorCode): number {
  switch (code) {
    case 'VALIDATION_ERROR':
    case 'PARSING_ERROR':
      return 400;
    case 'NOT_IMPLEMENTED':
      return 501;
    case 'AGENT_TIMEOUT':
      return 504;
    case 'PROVIDER_ERROR':
    case 'WORKFLOW_ERROR':
      return 502;
    default:
      return 500;
  }
}
