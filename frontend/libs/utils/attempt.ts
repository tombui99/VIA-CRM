type Success<T> = { result: T; error: null };
type Failure<E> = { result: null; error: E };
type AttemptResultSync<T, E> = Success<T> | Failure<E>;
type AttemptResultAsync<T, E> = Promise<AttemptResultSync<T, E>>;

/**
 * Attempts to execute a synchronous or asynchronous operation, returning a result object.
 *
 * - If given a Promise, returns a Promise that resolves to `{ result, error }`.
 * - If given a function, executes it and returns `{ result, error }`.
 */
export function attempt<T, E = Error>(operation: Promise<T>): AttemptResultAsync<T, E>;
export function attempt<T, E = Error>(operation: () => T): AttemptResultSync<T, E>;
export function attempt<T, E = Error>(
  operation: Promise<T> | (() => T)
): AttemptResultSync<T, E> | AttemptResultAsync<T, E> {
  if (operation instanceof Promise) {
    return operation
      .then((value: T) => ({ result: value, error: null }))
      .catch((error: E) => ({ result: null, error }));
  }

  try {
    const result = operation();
    return { result, error: null };
  } catch (error) {
    return { result: null, error: error as E };
  }
}

/**
 * Convenience function for synchronous operations that do not require lazy evaluation.
 *
 * Use this when you have a value or an expression that might throw during evaluation,
 * but you do not want to wrap it in a function. This is useful for cases where
 * you want to avoid the extra function wrapper required by `attempt(() => ...)`.
 *
 * Example:
 *   const result = attemptSync(JSON.parse(someString));
 */
export function attemptSync<T, E = Error>(operation: () => T): AttemptResultSync<T, E> {
  try {
    // For operations that might throw during evaluation
    return { result: operation(), error: null };
  } catch (error) {
    return { result: null, error: error as E };
  }
}

/**
 * Attempts to execute multiple asynchronous operations in parallel, returning their results.
 *
 * Uses Promise.allSettled to ensure all operations complete regardless of failures.
 * Each operation's result follows the same { result, error } pattern as `attempt()`.
 *
 * @param operations Array of promises to execute in parallel
 * @returns Promise resolving to array of attempt results
 *
 * Example:
 *   const [user, settings, groups] = await attemptParallel([
 *     userService.getUser(id),
 *     settingsService.getSettings(),
 *     groupService.getGroups()
 *   ]);
 */
export function attemptParallel<T extends readonly unknown[], E = Error>(
  operations: readonly [...{ [K in keyof T]: Promise<T[K]> }]
): Promise<{ [K in keyof T]: AttemptResultSync<T[K], E> }> {
  return Promise.allSettled(operations).then((results) =>
    results.map((result) =>
      result.status === 'fulfilled'
        ? { result: result.value, error: null }
        : { result: null, error: result.reason as E }
    )
  ) as Promise<{ [K in keyof T]: AttemptResultSync<T[K], E> }>;
}

/**
 * Attempts to execute multiple asynchronous operations in parallel with fail-fast behavior.
 *
 * If all operations succeed, returns a destructurable array of results.
 * If any operation fails, returns an error for the entire operation.
 *
 * @param operations Array of promises to execute in parallel
 * @returns Promise resolving to either array of results or single error
 *
 * Example:
 *   const { result, error } = await attemptParallelFailFast([
 *     userService.getUser(id),
 *     settingsService.getSettings(),
 *     groupService.getGroups()
 *   ]);
 *
 *   if (error) {
 *     // Handle error
 *     return;
 *   }
 *
 *   const [user, settings, groups] = result;
 */
export function attemptParallelFailFast<T extends readonly unknown[], E = Error>(
  operations: readonly [...{ [K in keyof T]: Promise<T[K]> }]
): Promise<AttemptResultSync<T, E>> {
  return Promise.all(operations)
    .then((results) => ({ result: results, error: null }))
    .catch((error) => ({ result: null, error: error as E }));
}
