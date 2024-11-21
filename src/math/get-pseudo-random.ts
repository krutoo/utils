/**
 * Returns a pseudo random number generator based on seed from first argument.
 * Thanks for author of this article: http://indiegamr.com/generate-repeatable-random-numbers-in-js/.
 * @param seed Seed - finite number.
 * @return Function that returns pseudo random number from 0 to 1.
 * @example
 * ```ts
 * import { getPseudoRandom } from "@krutoo/utils";
 *
 * // First we create a "random" function...
 * const random = getPseudoRandom(123);
 *
 * // ...and it works like Math.random()
 * console.log(random()); // 0.11539780521262002
 * ```
 */
export function getPseudoRandom(seed: number): () => number {
    let value = seed;

    return (): number => {
        // these magic values provides most random numbers
        value = (value * 9301 + 49297) % 233280;

        // move value in range 0-1
        return value / 233280;
    };
}
