import { Resend } from 'resend'
import { lazyClient } from './lazy-client'

export const resend = lazyClient<Resend>(() => {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return new Resend(key)
}, 'Resend')

export async function sendEmail({
  to,
  subject,
  react,
  text,
}: {
  to: string | string[]
  subject: string
  react?: React.ReactElement
  text?: string
}) {
  const from = process.env.EMAIL_FROM
  if (!from) throw new Error('EMAIL_FROM is not set')
  const apiKey = process.env.RESEND_API_KEY
  console.log('[resend] Sending email:', { from, to, subject, hasApiKey: !!apiKey })
  const result = await resend.emails.send({
    from,
    to,
    subject,
    react,
    text,
  })
  console.log('[resend] Response:', JSON.stringify(result))
  return result
}
