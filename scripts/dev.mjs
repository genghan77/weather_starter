import { spawn } from 'node:child_process';
import path from 'node:path';

const nodeOptions = [process.env.NODE_OPTIONS, '--disable-warning=ExperimentalWarning']
  .filter(Boolean)
  .join(' ');

const portlessPath = path.resolve(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'portless.cmd' : 'portless',
);

const command = `"${portlessPath}" run --name weather-starter tsx watch backend/src/server.ts`;

const child = spawn(command, {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: nodeOptions,
    PORTLESS_HTTPS: process.env.PORTLESS_HTTPS ?? '0',
    PORTLESS_PORT: process.env.PORTLESS_PORT ?? '1355',
  },
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
