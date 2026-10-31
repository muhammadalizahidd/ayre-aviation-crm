import { newCorrelationId, type ProblemDetails } from '@/shared/problem';

/** The in-process equivalent of an HTTP response. */
export interface BackendResponse<T = unknown> {
  status: number;
  body: T | ProblemDetails;
}

export const ok = <T>(body: T): BackendResponse<T> => ({ status: 200, body });

export const problem = (
  status: number,
  code: string,
  title: string,
  extra: Pick<ProblemDetails, 'detail' | 'fieldErrors'> = {},
  correlationId: string = newCorrelationId(),
): BackendResponse<never> => ({
  status,
  body: { code, title, status, correlationId, ...extra },
});

export const isProblem = (body: unknown): body is ProblemDetails =>
  typeof body === 'object' &&
  body !== null &&
  'code' in body &&
  'correlationId' in body &&
  'status' in body;
