const path = require('path')

const repoRoot = __dirname

module.exports = {
  apps: [
    {
      name: 'endow-web',
      cwd: path.join(repoRoot, 'apps', 'web'),
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'endow-socket',
      cwd: path.join(repoRoot, 'apps', 'socket-server'),
      // Run via tsx so `env-loader.cjs` resolves the repo root correctly
      // (esbuild bundling would relocate __dirname and break env loading).
      script: 'node_modules/.bin/tsx',
      args: 'src/index.ts',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
