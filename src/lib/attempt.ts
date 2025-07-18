type AttemptSuccess<T> = readonly [null, T];
type AttemptFailure<E> = readonly [E, null];
type AttemptResult<E, T> = AttemptSuccess<T> | AttemptFailure<E>;
type AttemptResultAsync<E, T> = Promise<AttemptResult<E, T>>;
/**
 * Safely executes operations that might throw errors, returning a tuple-style result
 * instead of throwing exceptions. Returns [error, null] on failure or [null, data] on success.
 *
 * Handles both synchronous functions and Promises, automatically detecting the type
 * and returning the appropriate result format.
 *
 * @param operation - A Promise to await or a function to execute
 * @returns For Promises: Promise resolving to [error, null] or [null, data]
 *          For functions: [error, null] or [null, data]
 *
 * @example
 * ```typescript
 * // With async operations
 * const [error, user] = await attempt(fetchUser(id));
 * if (error) {
 *   console.error('Failed to fetch user:', error);
 * } else {
 *   console.log('User:', user);
 * }
 *
 * // With sync operations
 * const [parseError, data] = attempt(() => JSON.parse(jsonString));
 * if (parseError) {
 *   console.error('Invalid JSON:', parseError);
 * } else {
 *   console.log('Parsed data:', data);
 * }
 * ```
 */
export function attempt<E = Error, T = Promise<any>>(operation: T): AttemptResultAsync<E, T>;
export function attempt<E = Error, T = any>(operation: () => T): AttemptResult<E, T>;
export function attempt<E = Error, T = any>(
  operation: Promise<T> | (() => T),
): AttemptResult<E, T> | AttemptResultAsync<E, T> {
  if (operation instanceof Promise) {
    return operation
      .then((value: T) => [null, value] as const)
      .catch((error: E) => [error, null] as const);
  }

  try {
    const data = operation();
    return [null, data];
  } catch (error) {
    return [error as E, null];
  }
}
