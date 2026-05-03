import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

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
      const pi: any = event.data.object
      if (pi.metadata?.type === 'session_payment') {
        await prisma.bookingSession.update({
          where: { id: pi.metadata.sessionId },
          data: { stripePaymentId: pi.id, amountPaid: pi.amount / 100 },
        })
      }
      if (pi.metadata?.type === 'referral_redeem') {
        await prisma.studentProfile.update({
          where: { id: pi.metadata.studentProfileId },
          data: { referralBalance: { decrement: parseInt(pi.metadata.creditsUsed) } },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
