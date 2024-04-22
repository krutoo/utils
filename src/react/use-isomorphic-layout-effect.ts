import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect: typeof useEffect =
  // deno-lint-ignore no-explicit-any
  typeof window !== "undefined" && !(globalThis as any).Deno
    ? useLayoutEffect
    : useEffect;
