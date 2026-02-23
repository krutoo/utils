import fs from 'node:fs/promises';

await fs.rm('./package.json', { recursive: true, force: true });
await fs.rename('./package.json.copy', './package.json');
