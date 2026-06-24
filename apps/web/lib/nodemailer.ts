import nodemailer from 'nodemailer'

let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null

export function getTransporter() {
  if (!_transporter) {
    const user = process.env.GMAIL_USER
    const pass = process.env.GMAIL_APP_PASSWORD
    if (!user || !pass) {
      throw new Error(
        'GMAIL_USER and GMAIL_APP_PASSWORD must be set in environment variables'
      )
    }
    _transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    })
  }
  return _transporter
}
