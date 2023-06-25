import type { TRPCClientError } from '@trpc/client';

/**
 * @example
 * const { isLoading, mutate } = trpc.userEdit.useMutation(
 *   { id: userId },
 *   {
 *     retry: (failureCount, err) => failureCount < MAX_TRIES && isTRPCVercelTimeout(err),
 *   },
 * );
 */
export function isTRPCVercelTimeout(err: TRPCClientError<unknown>): boolean {
  return !!err.cause && isTimeoutSyntaxError(err.cause);
}

/**
 * @example
 * const res = await fetch('/api/endpoint');
 * if (isVercelTimeout(res)) {
 *   return retry();
 * }
 *
 * @example
 * try {
 *   const res = await fetch('/api/endpoint');
 *   const data = await res.json();
 *   // ...
 * } catch (error) {
 *   if (isVercelTimeout(error)) {
 *     return retry();
 *   }
 * }
 */
export function isVercelTimeout(resOrErr: Error | Response): boolean {
  if (resOrErr instanceof Error) {
    return isTimeoutSyntaxError(resOrErr);
  } else {
    return resOrErr.status === 504;
  }
}

// Helper for cases where the response body was optimistically parsed as JSON
function isTimeoutSyntaxError(error: Error) {
  // The original text body of a Vercel timeout looks like:
  // `An error occurred with your deployment\n\nFUNCTION_INVOCATION_TIMEOUT`
  return error.name === 'SyntaxError' && error.message.includes("Unexpected token 'A',");
}
