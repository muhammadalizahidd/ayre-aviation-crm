/**
 * Error contract shared by every layer. Mirrors RFC 7807 Problem Details (AGENTS.md API-03),
 * so the mock backend and a future real backend fail in the same shape.
 */
export interface ProblemDetails {
  /** Stable machine-readable code, for example `auth.invalid_credentials`. */
  code: string;
  title: string;
  detail?: string;
  status: number;
  /** Field-level messages keyed by field name. */
  fieldErrors?: Record<string, string>;
  correlationId: string;
}

/** Thrown by the API client when the backend answers with a problem. */
export class ApiError extends Error {
  readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.title);
    this.name = 'ApiError';
    this.problem = problem;
  }
}

/** Short random id used to correlate a request across layers and logs. */
export const newCorrelationId = (): string =>
  `cid-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
