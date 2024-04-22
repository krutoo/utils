import { build, emptyDir } from '@deno/dnt';
import denoJson from '../deno.json' with { type: 'json' };

await emptyDir('./npm');

await build({
  entryPoints: Object.entries(denoJson.exports).map(([name, path]) =>
    name === '.' ? name : { name, path }
  ),
  outDir: './npm',
  shims: {
    deno: false,
  },
  test: false,
  package: {
    name: denoJson.name,
    version: Deno.args[0] ?? '0.0.0',
    description: 'Set of utilities for JS fetch function',
    author: 'Dmitry Petrov',
    license: 'Apache-2.0',
    repository: {
      type: 'git',
      url: 'git+https://github.com/krutoo/utils.git',
    },
    bugs: {
      url: 'https://github.com/krutoo/utils/issues',
    },
    peerDependencies: {
      '@types/react': '^17 || ^18',
    },
  },
  compilerOptions: {
    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
  },
  async postBuild() {
    await Deno.copyFile('README.md', './npm/README.md');
    await Deno.copyFile('LICENSE', './npm/LICENSE');
  },
});
