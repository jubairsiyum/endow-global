import { getTransporter } from './nodemailer'

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string | string[]
  subject: string
  text?: string
  html?: string
}) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  if (!from) throw new Error('SMTP_FROM or SMTP_USER is not set')

  const transporter = getTransporter()

  console.log('[email] Sending email:', { from, to, subject })
  const result = await transporter.sendMail({
    from,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    text,
    html,
  })
  console.log('[email] Sent successfully:', result.messageId)
  return result
}
