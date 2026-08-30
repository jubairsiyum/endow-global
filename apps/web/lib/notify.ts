import { eq as eqFn } from 'drizzle-orm'
import { sendEmail } from './email'

const eq = eqFn as any

function layout({
  eyebrow,
  heading,
  body,
  details,
  cta,
  note,
}: {
  eyebrow: string
  heading: string
  body: string
  details?: { label: string; value: string }[]
  cta?: { label: string; url: string }
  note?: string
}): string {
  const detailRows = (details || [])
    .map(
      (d) => `<tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;"><span style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.04em;">${d.label}</span><br/><strong style="font-size:15px;color:#0f172a;">${d.value}</strong></td></tr>`
    )
    .join('')

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f8f9fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Space Grotesk',Roboto,Helvetica,Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;"><tr><td align="center"><table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 40px rgba(10,10,10,0.08);"><tr><td style="background:#c41e3a;background-image:linear-gradient(135deg,#c41e3a 0%,#a01830 100%);padding:30px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle;width:52px;"><div style="width:48px;height:48px;border-radius:12px;background:#ffffff;text-align:center;line-height:48px;"><img src="https://endowglobaledu.com/logo/endoedu.svg" alt="Endow Global Education" width="34" height="34" style="display:inline-block;vertical-align:middle;border:0;"></div></td><td style="padding-left:14px;vertical-align:middle;"><span style="display:block;font-size:18px;font-weight:800;letter-spacing:-0.01em;color:#ffffff;">Endow Global</span><span style="display:block;margin-top:2px;font-size:11px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#f3c19a;">Education</span></td></tr></table></td></tr><tr><td style="height:4px;background:#b8934a;"></td></tr><tr><td style="padding:40px 40px 32px;"><p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#c41e3a;">${eyebrow}</p><h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;font-weight:800;letter-spacing:-0.02em;color:#0a0a0a;">${heading}</h1><p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#52525b;">${body}</p>${
    detailRows
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${detailRows}</table>`
      : ''
  }${
    cta
      ? `<a href="${cta.url}" style="display:inline-block;background:linear-gradient(135deg,#c41e3a,#a01830);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 26px;border-radius:12px;">${cta.label}</a>`
      : ''
  }${
    note
      ? `<p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#94a3b8;">${note}</p>`
      : ''
  }</td></tr><tr><td style="padding:18px 40px;background:#f8fafc;text-align:center;"><span style="font-size:11px;color:#94a3b8;">Endow Global Education · endowglobaledu.com</span></td></tr></table></td></tr></table></body></html>`
}

async function resolveCounselorEmail(db: any, schema: any, counselorId: string) {
  const [row] = await db
    .select({ email: schema.users.email, name: schema.users.name })
    .from(schema.counselorProfiles)
    .leftJoin(schema.users, eq(schema.users.id, schema.counselorProfiles.userId))
    .where(eq(schema.counselorProfiles.id, counselorId))
    .limit(1)
  return row ?? null
}

/** Notify a counselor that a new student was assigned to them. */
export async function notifyCounselorNewStudent(
  db: any,
  schema: any,
  opts: { counselorId: string; studentName: string; studentEmail: string; studentPhone?: string }
) {
  const counselor = await resolveCounselorEmail(db, schema, opts.counselorId)
  if (!counselor?.email) return

  const details = [
    { label: 'Student', value: opts.studentName || 'New student' },
    { label: 'Email', value: opts.studentEmail || '—' },
  ]
  if (opts.studentPhone) details.push({ label: 'Phone', value: opts.studentPhone })

  await sendEmail({
    to: counselor.email,
    subject: 'New student assigned to you — Endow Global',
    text: `A new student ${opts.studentName || ''} (${opts.studentEmail || ''}) has been assigned to you. Please reach out to guide them through their study abroad journey.`,
    html: layout({
      eyebrow: 'New Student Assigned',
      heading: 'A new student is now yours to guide',
      body: `A new student has been assigned to you on Endow Global. Please get in touch to kick off their study abroad journey.`,
      details,
      cta: { label: 'View your students', url: 'https://endowglobaledu.com/counselor/students' },
      note: 'This is an automated notification. Reach out to the student to schedule your first consultation.',
    }),
  })
}

/** Notify the counselor + student that a session has been booked. */
export async function notifySessionBooked(
  db: any,
  schema: any,
  opts: {
    counselorId: string
    studentEmail: string
    studentName: string
    scheduledAt: Date
    duration: number
    meetingUrl?: string | null
  }
) {
  const counselor = await resolveCounselorEmail(db, schema, opts.counselorId)
  if (!counselor?.email) return

  const when = new Date(opts.scheduledAt)
  const dateStr = when.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })
  const meetingDetails = opts.meetingUrl
    ? [
        {
          label: 'Meeting link',
          value: `<a href="${opts.meetingUrl}" style="color:#2563eb;word-break:break-all;text-decoration:underline;">${opts.meetingUrl}</a>`,
        },
      ]
    : [{ label: 'Meeting link', value: 'To be shared shortly' }]

  const sessionInfo = [
    { label: 'Date & time', value: dateStr },
    { label: 'Duration', value: `${opts.duration} minutes` },
    ...meetingDetails,
  ]

  // Counselor notification
  await sendEmail({
    to: counselor.email,
    subject: `Session booked: ${dateStr} — Endow Global`,
    text: `A student ${opts.studentName || ''} booked a ${opts.duration} minute session with you on ${dateStr}.${opts.meetingUrl ? ` Meeting link: ${opts.meetingUrl}` : ''}`,
    html: layout({
      eyebrow: 'Session Booked',
      heading: 'You have a new session',
      body: `${opts.studentName || 'Your student'} has booked a session with you. Here are the details:`,
      details: sessionInfo,
      cta: { label: 'Open your calendar', url: 'https://endowglobaledu.com/counselor/sessions' },
    }),
  })

  // Student confirmation
  await sendEmail({
    to: opts.studentEmail,
    subject: `Your session is confirmed: ${dateStr} — Endow Global`,
    text: `Your ${opts.duration} minute session with ${counselor.name || 'your counselor'} is confirmed for ${dateStr}.${opts.meetingUrl ? ` Meeting link: ${opts.meetingUrl}` : ''}`,
    html: layout({
      eyebrow: 'Session Confirmed',
      heading: 'Your session is booked',
      body: `Your session with ${counselor.name || 'your counselor'} is confirmed.`,
      details: sessionInfo,
      cta: { label: 'View appointments', url: 'https://endowglobaledu.com/dashboard/appointments' },
    }),
  })
}
