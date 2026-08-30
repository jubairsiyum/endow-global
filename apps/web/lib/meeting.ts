/**
 * Generate a meeting URL for a booking session.
 *
 * Priority:
 * 1. If GOOGLE_MEET integration is configured (env `GOOGLE_MEET_ENABLED=true`
 *    and a Calendar API integration exists), a real Google Meet link would be
 *    created there. Currently this file provides a deterministic fallback that
 *    requires no external API keys.
 * 2. Fallback is a Jitsi Meet room (or a configurable base URL).
 *
 * Jitsi Meet rooms require no auth and are unique per booking. For a
 * production Zoom / Google Meet integration, replace `generateMeetingUrl`
 * with a call to the provider API and store the returned `meetingUrl`.
 */

function genId(): string {
  return globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

export function generateMeetingUrl(bookingId?: string): string {
  // Allow operators to configure a custom base (e.g. Zoom vanity URL or
  // Google Meet prefix) without code changes.
  const base = process.env.MEETING_URL_BASE || process.env.NEXT_PUBLIC_MEETING_URL_BASE || 'https://meet.jit.si'
  const prefix = process.env.MEETING_URL_PREFIX || 'endow'

  const suffix = bookingId ? bookingId.slice(0, 12) : genId()
  // Jitsi rooms are just URLs — uniqueness comes from the suffix.
  // Example: https://meet.jit.si/endow-a1b2c3d4e5f6
  const normalizedBase = base.replace(/\/$/, '')
  return `${normalizedBase}/${prefix}-${suffix}`
}

/**
 * Generate a Google Meet link via Google Calendar API (placeholder).
 * Returns null when Google Meet is not configured; caller should fall back to
 * `generateMeetingUrl`.
 *
 * To implement for real:
 *  - Store a service-account or OAuth token.
 *  - Call calendar.events.insert with conferenceData.createRequest.
 *  - Return conferenceData.entryPoints[0].uri
 */
export async function generateGoogleMeetLink(_opts: {
  summary: string
  start: Date
  end: Date
  attendees: string[]
}): Promise<string | null> {
  if (process.env.GOOGLE_MEET_ENABLED !== 'true') return null
  // TODO: implement Google Calendar conference creation when credentials are set.
  return null
}

export async function resolveMeetingUrl(opts: {
  bookingId: string
  summary?: string
  start?: Date
  end?: Date
  attendees?: string[]
}): Promise<string> {
  // Attempt Google Meet first if enabled; otherwise fallback to Jitsi.
  if (opts.start && opts.end && process.env.GOOGLE_MEET_ENABLED === 'true') {
    try {
      const googleUrl = await generateGoogleMeetLink({
        summary: opts.summary || 'Counseling session',
        start: opts.start,
        end: opts.end,
        attendees: opts.attendees || [],
      })
      if (googleUrl) return googleUrl
    } catch (err) {
      console.warn('[meeting] Google Meet generation failed, falling back to Jitsi:', err)
    }
  }
  return generateMeetingUrl(opts.bookingId)
}
