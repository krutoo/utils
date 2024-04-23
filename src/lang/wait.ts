/**
 * Returns promise that resolves after specified timeout.
 * @param ms Timeout in milliseconds.
 * @returns Promise.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((done) => setTimeout(done, ms));
}
