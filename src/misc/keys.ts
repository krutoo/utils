/**
 * Returns generator that iterates over each unique own enumerable key of all given objects.
 * @param objects Objects to pick keys.
 * @yields Every unique own key.
 */
export function* keys(...objects: Array<Record<string, any>>): Generator<string, void, unknown> {
  // Object.create(null) instead Set for more efficiently memory usage on small objects
  const seen: Record<string, boolean> = Object.create(null);

  // "for" instead "for of" for performance (no extra iterators)
  for (let i = 0; i < objects.length; i++) {
    const item = objects[i];

    // filter spares in objects array
    if (!item) continue;

    // Object.keys to get only own enumerable string keys and ignore spares
    const itemKeys = Object.keys(item);

    // "for" instead "for of" for performance (no extra iterators)
    for (let j = 0; j < itemKeys.length; j++) {
      // non-null assertion because can guarantee that key is string here
      const key = itemKeys[j]!;

      // `key in seen` instead `seen[key]` for micro optimization
      if (!(key in seen)) {
        seen[key] = true;
        yield key;
      }
    }
  }
}
