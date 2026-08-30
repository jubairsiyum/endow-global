import Link from 'next/link'

type Props = {
  searchParams?: { error?: string; error_description?: string }
}

const ERROR_MAP: Record<string, { title: string; message: string; hint?: string }> = {
  account_not_linked: {
    title: 'Account already exists',
    message: 'An account with this email already exists using a different sign-in method.',
    hint: 'Try signing in with your original method (email & password or OTP). After you are signed in, you can link your Google account from your profile settings. Or use a different Google account.',
  },
  access_denied: {
    title: 'Access denied',
    message: 'You denied the permission request or the provider refused access.',
  },
  configuration: {
    title: 'Configuration error',
    message: 'There is a server configuration issue. Please contact support.',
  },
}

export default function AuthErrorPage({ searchParams }: Props) {
  const code = searchParams?.error ?? 'unknown'
  const desc = searchParams?.error_description
  const mapped = ERROR_MAP[code] ?? {
    title: 'Something went wrong',
    message: desc || 'We encountered an unexpected error. Please try again.',
  }

  const isAccountNotLinked = code === 'account_not_linked'

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-[560px] rounded-2xl border bg-white p-6 shadow-sm sm:p-8" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <span className="text-lg">!</span>
        </div>

        <h1 className="mt-4 text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>
          {mapped.title}
        </h1>

        {code && (
          <p className="mt-1 text-[11px] font-mono uppercase tracking-wider" style={{ color: '#9ca3af' }}>
            CODE: {code}
          </p>
        )}

        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: '#374151' }}>
          {mapped.message}
        </p>

        {mapped.hint && (
          <div className="mt-3 rounded-xl border bg-amber-50/50 px-3 py-2.5 text-[12px] leading-relaxed" style={{ borderColor: '#fde68a', color: '#92400e' }}>
            {mapped.hint}
          </div>
        )}

        {isAccountNotLinked && (
          <div className="mt-4 rounded-xl border bg-gray-50 px-3 py-3" style={{ borderColor: '#e5e7eb' }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
              What to do next
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-[12px] leading-relaxed" style={{ color: '#374151' }}>
              <li>
                Go to <Link href="/login" className="font-medium underline" style={{ color: '#111827' }}>Sign in</Link> with your password or OTP (the method you used first).
              </li>
              <li>
                Once signed in, open <span className="font-medium">Profile → Linked accounts</span> to connect Google.
              </li>
              <li>
                Or, sign in with a different Google account that is not already registered.
              </li>
            </ol>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#111827] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-black"
          >
            Go to Sign in
          </Link>
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center rounded-xl border bg-white px-4 py-2.5 text-[13px] font-semibold hover:bg-gray-50"
            style={{ borderColor: '#e5e7eb', color: '#111827' }}
          >
            Go Home
          </Link>
        </div>

        <p className="mt-4 text-center text-[11px]" style={{ color: '#9ca3af' }}>
          If this keeps happening, contact support with the code above.
        </p>
      </div>
    </div>
  )
}
