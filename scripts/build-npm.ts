import { build, emptyDir } from '@deno/dnt';
import denoJson from '../deno.json' with { type: 'json' };

await emptyDir('./npm');

await build({
  entryPoints: Object.entries(denoJson.exports).map(([name, path]) =>
    name === '.' ? path : { name, path }
  ),
  outDir: './npm',
  shims: {
    deno: false,
  },
  test: false,
  package: {
    name: denoJson.name,
    version: Deno.args[0] ?? '0.0.0',
    description: 'Set of useful utils for JavaScript/TypeScript projects',
    author: 'Dmitry Petrov',
    license: 'Apache-2.0',
    repository: {
      type: 'git',
      url: 'git+https://github.com/krutoo/utils.git',
    },
    bugs: {
      url: 'https://github.com/krutoo/utils/issues',
    },
    devDependencies: {
      '@types/react': '^17 || ^18',
    },
  },
  mappings: {
    'npm:@types/react@18': 'react',
  },
  compilerOptions: {
    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
  },
  async postBuild() {
    await Deno.copyFile('README.md', './npm/README.md');
    await Deno.copyFile('LICENSE', './npm/LICENSE');
  },
});
