import transporter from './nodemailer'

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
  const user = process.env.GMAIL_USER
  if (!user) throw new Error('GMAIL_USER is not set')

  const from = `Endow Global Education <${user}>`

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
