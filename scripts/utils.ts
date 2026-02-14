import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import { EOL } from 'node:os';
import path from 'node:path';

export function normalizePathname(pathname: string): string {
  if (pathname === '.' || pathname.startsWith('./') || pathname.startsWith('/')) {
    return pathname;
  }

  return `./${pathname}`;
}

export async function execAsync(cmd: string): Promise<void> {
  return await new Promise<void>((done, fail) => {
    const proc = exec(cmd, err => (err ? fail(err) : done()));

    proc.stdout?.pipe(process.stdout);
    proc.stderr?.pipe(process.stderr);
  });
}

export class JsonFile {
  filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  private read(): Promise<any> {
    return fs
      .readFile(this.filename, 'utf-8')
      .then(JSON.parse)
      .catch(() => ({}));
  }

  async setContent<T = any>(value: T | ((actual: T) => T)): Promise<void> {
    const current = await this.read();
    const added = typeof value === 'function' ? (value as (current: T) => T)(current) : value;

    const next = {
      ...current,
      ...added,
    };

    await fs.mkdir(path.dirname(this.filename), { recursive: true });
    await fs.writeFile(this.filename, JSON.stringify(next, null, 2));
  }

  async setProperty<T>(key: string, value: T | ((actual: T) => T)): Promise<void> {
    const current = await this.read();

    current[key] = typeof value === 'function' ? (value as (actual: T) => T)(current[key]) : value;

    await fs.mkdir(path.dirname(this.filename), { recursive: true });
    await fs.writeFile(this.filename, `${JSON.stringify(current, null, 2)}${EOL}`);
  }
}
