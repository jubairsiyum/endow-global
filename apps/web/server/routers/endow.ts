import { createTRPCRouter, protectedProcedure } from '@/lib/trpc'
import { z } from 'zod'
import { fetchStudentOverviewFromEndow } from '@/lib/endowConnect'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'

export const endowRouter = createTRPCRouter({
  getOverview: protectedProcedure
    .input(z.object({ studentId: z.string(), persist: z.boolean().optional() }))
    .query(async ({ input, ctx }) => {
      // Only allow fetching for the same student or staff/admin
      const requesterId = ctx.session!.user.id
      const role = ctx.session!.user.role
      if (role !== 'ADMIN' && role !== 'COUNSELOR' && requesterId !== input.studentId) {
        throw new Error('FORBIDDEN')
      }

      const overview = await fetchStudentOverviewFromEndow(input.studentId)

      if (input.persist) {
        // Map fields we know into studentProfiles
        const update: any = {}
        if (overview.nationality) update.nationality = overview.nationality
        if (overview.highestEducation) update.highestEducation = overview.highestEducation
        if (typeof overview.gpa === 'number') update.gpa = overview.gpa
        if (typeof overview.ieltsScore === 'number') update.ieltsScore = overview.ieltsScore
        if (typeof overview.toeflScore === 'number') update.toeflScore = overview.toeflScore
        if (overview.targetCountries) update.targetCountries = overview.targetCountries
        if (overview.targetSubjects) update.targetSubjects = overview.targetSubjects

        await db.update(schema.studentProfiles).set(update).where(eq(schema.studentProfiles.userId, input.studentId))
      }

      return overview
    }),
})
