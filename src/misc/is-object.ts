/**
 * Returns true when value is any object, false when it is primitive.
 * @param value Any kind of JS value.
 * @returns Boolean.
 */
export function isObject(value: unknown): value is object {
  const type = typeof value;

  return (type === 'object' && value !== null) || type === 'function';
}
