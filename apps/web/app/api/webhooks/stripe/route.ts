import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db, schema } from '@/lib/db'
import { eq, sql } from 'drizzle-orm'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object
      if (pi.metadata?.type === 'session_payment') {
        await db
          .update(schema.bookingSessions)
          .set({ stripePaymentId: pi.id, amountPaid: pi.amount / 100 })
          .where(eq(schema.bookingSessions.id, pi.metadata.sessionId))
      }
      if (pi.metadata?.type === 'referral_redeem') {
        await db
          .update(schema.studentProfiles)
          .set({ referralBalance: sql`referral_balance - ${parseInt(pi.metadata.creditsUsed)}` })
          .where(eq(schema.studentProfiles.id, pi.metadata.studentProfileId))
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
