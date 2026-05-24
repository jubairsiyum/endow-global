// Re-export BetterAuth helpers so that existing `import { auth } from '@/lib/auth'`
// and `import { getSession } from '@/lib/auth'` continue to work unchanged.
export { auth, getSession } from './auth/better-auth'
export type { AuthSession } from './auth/better-auth'
