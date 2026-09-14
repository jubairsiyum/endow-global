const path = require('path')

const repoRoot = __dirname

module.exports = {
  apps: [
    {
      name: 'endow-web',
      cwd: path.join(repoRoot, 'apps', 'web'),
      // Point at Next's JS entrypoint. `node_modules/.bin/next` is a shell
      // shim on Linux, which PM2 cannot execute through the Node interpreter.
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      interpreter: 'node',
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
      // Use tsx's real JS entrypoint, not the `.bin` shell shim.
      script: 'node_modules/tsx/dist/cli.mjs',
      args: 'src/index.ts',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        SOCKET_PORT: 3001,
      },
    },
  ],
}
