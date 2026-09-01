// Guard against running a second `next dev` on the same machine/port.
//
// Root cause of intermittent `/_next/static/*` 404s: two Next.js dev servers
// sharing the same `apps/web/.next` directory race to write app-build-manifest,
// _buildManifest and generated chunks. The browser loads a page that references
// chunks from server A, then server B recompiles and deletes/replaces those
// chunks with new hashes -> 404. Restarting "fixes" it because the duplicate
// process is killed and a single clean server rebuilds consistent assets.
//
// This script exits non-zero if another process is already listening on the
// dev port, so `pnpm dev` fails fast instead of silently starting a second
// server against the same .next. It only runs in development.
import net from 'node:net'

const port = Number(process.env.PORT || process.env.NEXT_PUBLIC_APP_PORT || 3000)

const socket = net.connect({ port, host: '127.0.0.1' })

socket.once('connect', () => {
  socket.destroy()
  console.error(
    `\n[check-dev-port] A process is already listening on http://localhost:${port}.`
  )
  console.error(
    '[check-dev-port] Refusing to start a second `next dev`. Two dev servers\n' +
      '[check-dev-port] sharing the same apps/web/.next directory corrupt each other\'s\n' +
      '[check-dev-port] generated assets and cause intermittent `_next/static` 404s.\n' +
      '[check-dev-port] Stop the existing server (Ctrl+C) before starting a new one.\n'
  )
  process.exit(1)
})

socket.once('error', () => {
  // Nothing is listening yet — safe to start.
  socket.destroy()
  process.exit(0)
})
