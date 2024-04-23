/**
 * Returns promise that resolves after specified timeout.
 * @param ms Timeout in milliseconds.
 * @returns Promise.
 */
export function wait(ms: number) {
  return new Promise((done) => setTimeout(done, ms));
}
