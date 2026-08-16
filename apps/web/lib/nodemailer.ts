import nodemailer from 'nodemailer'

let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null

export function getTransporter() {
  if (!_transporter) {
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const secure = process.env.SMTP_SECURE === 'true'
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASSWORD

    if (!host || !user || !pass) {
      throw new Error(
        'SMTP_HOST, SMTP_USER and SMTP_PASSWORD must be set in environment variables'
      )
    }

    _transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    })
  }
  return _transporter
}
