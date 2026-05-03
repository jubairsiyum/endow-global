import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { stripe } from '@/lib/stripe'

const MIN_REDEEM = 500
const BDT_TO_USD = 110

export const referralRouter = createTRPCRouter({
  getMyCode: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.studentProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
    if (!profile) throw new Error('Student profile not found')

    const code = profile.referralCode
    return {
      code,
      link: `https://endowglobal.com/register?ref=${code}`,
    }
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.studentProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
    if (!profile) throw new Error('Student profile not found')

    const successful = await ctx.prisma.referral.count({
      where: { referrerId: profile.userId, status: { in: ['COMPLETED', 'REWARDED'] } },
    })

    const totalCredits = profile.referralBalance

    return { successful, totalCredits }
  }),

  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.studentProfile.findUnique({
      where: { userId: ctx.session.user.id },
    })
    if (!profile) throw new Error('Student profile not found')

    const balanceBDT = profile.referralBalance
    const balanceUSD = Math.round((balanceBDT / BDT_TO_USD) * 100) / 100

    return { balanceBDT, balanceUSD, rate: BDT_TO_USD }
  }),

  redeem: protectedProcedure
    .input(z.object({ credits: z.number().int().min(MIN_REDEEM) }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.studentProfile.findUnique({
        where: { userId: ctx.session.user.id },
      })
      if (!profile) throw new Error('Student profile not found')
      if (profile.referralBalance < input.credits) {
        throw new Error('Insufficient referral balance')
      }

      const coupon = await stripe.coupons.create({
        amount_off: input.credits * 100,
        currency: 'bdt',
        duration: 'once',
        name: `Endow referral credit (${input.credits} BDT)`,
      })

      await ctx.prisma.studentProfile.update({
        where: { id: profile.id },
        data: { referralBalance: { decrement: input.credits } },
      })

      return { success: true, couponId: coupon.id }
    }),
})
