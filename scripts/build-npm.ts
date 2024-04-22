import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: [
    "./src/mod.ts",
    {
      name: "./dom",
      path: "./src/dom/mod.ts",
    },
    {
      name: "./math",
      path: "./src/math/mod.ts",
    },
    {
      name: "./react",
      path: "./src/react/mod.ts",
    },
    {
      name: "./types",
      path: "./src/types/mod.ts",
    },
  ],
  outDir: "./npm",
  shims: {
    deno: false,
  },
  test: false,
  package: {
    name: "@krutoo/fetch-tools",
    version: Deno.args[0] ?? "0.0.0",
    description: "Set of utilities for JS fetch function",
    author: "Dmitry Petrov",
    license: "Apache-2.0",
    repository: {
      type: "git",
      url: "git+https://github.com/krutoo/utils.git",
    },
    bugs: {
      url: "https://github.com/krutoo/utils/issues",
    },
    peerDependencies: {
      "@types/react": "^17 || ^18",
    },
  },
  compilerOptions: {
    lib: ["ES2022", "DOM", "DOM.Iterable"],
  },
  async postBuild() {
    await Deno.copyFile("README.md", "./npm/README.md");
    await Deno.copyFile("LICENSE", "./npm/LICENSE");
  },
});
