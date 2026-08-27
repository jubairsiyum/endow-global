'use client'

import { createContext, useContext, useMemo } from 'react'

import { useSession } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'

interface UserAvatarContextValue {
  image: string | null
  isPending: boolean
}

const UserAvatarContext = createContext<UserAvatarContextValue>({
  image: null,
  isPending: false,
})

export function useUserAvatar() {
  return useContext(UserAvatarContext)
}

// Single reactive, database-backed source of the signed-in user's profile
// photo. Reads from `user.getProfile` (which queries the `users` table
// directly) so it stays in sync with the upstream `users.image` column and
// updates across the whole portal the moment the profile image changes —
// instead of relying on the auth session cookie, which may serve stale data.
export function UserAvatarProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: sessionPending } = useSession()
  const authenticated = Boolean(session?.user)

  const { data: profile, isPending: profilePending } = trpc.user.getProfile.useQuery(undefined, {
    retry: false,
    enabled: authenticated,
    staleTime: 30 * 1000,
  })

  const value = useMemo<UserAvatarContextValue>(
    () => ({ image: profile?.image ?? null, isPending: sessionPending || profilePending }),
    [profile?.image, sessionPending, profilePending]
  )

  return <UserAvatarContext.Provider value={value}>{children}</UserAvatarContext.Provider>
}
