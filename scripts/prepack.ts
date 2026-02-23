import fs from 'node:fs/promises';
import { JsonFile } from './utils.ts';

await fs.cp('./package.json', './package.json.copy');
const file = new JsonFile('./package.json');

await file.setProperty('scripts', undefined);
await file.setProperty('devEngines', undefined);
await file.setProperty('devDependencies', undefined);
