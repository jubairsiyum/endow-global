import { Suspense } from 'react'
import ProfileCompletion from '@/components/auth/ProfileCompletion'

export default function OnboardingPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <Suspense>
        <ProfileCompletion />
      </Suspense>
    </main>
  )
}
