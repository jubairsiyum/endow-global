module.exports = {
  apps: [
    {
      name: 'endow-web',
      cwd: '/var/www/endow-global',
      script: 'pnpm',
      args: '--filter @endow/web start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      time: true,
    },
    {
      name: 'endow-socket',
      cwd: '/var/www/endow-global',
      script: 'pnpm',
      args: '--filter @endow/socket-server start',
      env: {
        NODE_ENV: 'production',
        SOCKET_PORT: 3001,
      },
      time: true,
    },
  ],
}
