import nodemailer from 'nodemailer'
import { lazyClient } from './lazy-client'

const transporter = lazyClient(() => {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD must be set')
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}, 'Nodemailer Gmail SMTP')

export default transporter
