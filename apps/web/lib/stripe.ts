import Stripe from 'stripe'
import { lazyClient } from './lazy-client'

export const stripe = lazyClient<Stripe>(
  () => {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    return new Stripe(key, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  },
  'Stripe',
)
