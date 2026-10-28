import { z } from 'zod'
import { createTRPCRouter, publicProcedure, adminWithPermission } from '@/lib/trpc'
import { TRPCError } from '@trpc/server'
import { db, schema } from '@endow/db'
import {
  eq as _eq,
  desc as _desc,
  and as _and,
  like as _like,
  or as _or,
  count as _count,
  sql as _sql,
  ne as _ne,
} from 'drizzle-orm'

const eq = _eq as any
const desc = _desc as any
const and = _and as any
const like = _like as any
const or = _or as any
const count = _count as any
const sql = _sql as any
const ne = _ne as any

function genId() {
  return globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 25)
}

/**
 * Normalizes phone numbers (especially Bangladesh numbers) so:
 * +8801891787808, 8801891787808, +881891787808, 01891787808, 1891787808
 * all resolve to the canonical 11-digit representation: "01891787808".
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return ''
  let digits = rawPhone.replace(/\D/g, '')

  // 1) Starts with Bangladesh country code 880 (e.g. 8801891787808 -> 13 digits)
  if (digits.startsWith('880')) {
    digits = digits.slice(2) // removes '88', leaves '01891787808' (11 digits)
  }
  // 2) Starts with 88 followed directly by 1 (e.g. 881891787808 -> 12 digits)
  else if (digits.startsWith('88') && digits.length === 12 && digits.charAt(2) === '1') {
    digits = '0' + digits.slice(2) // '01891787808'
  }

  // 3) Entered without leading zero (10 digits starting with 1, e.g. 1891787808)
  if (digits.length === 10 && digits.startsWith('1')) {
    digits = '0' + digits // becomes '01891787808' (11 digits)
  }

  return digits
}

/**
 * Comprehensive duplicate phone lead finder.
 * Matches:
 * 1. Normalized BD phones (11 digits e.g. 01891787808)
 * 2. Raw phones with country codes (+880, 880, +88, 88)
 * 3. Phones entered without leading 0 (10 digits e.g. 1891787808)
 * 4. Phones with spaces or dashes (+88 01891-787808)
 * 5. Bangladesh 10-digit suffix matching (e.g. ends with 1891787808)
 */
export async function findDuplicatePhoneLead(
  phoneInput: string,
  excludeLeadId?: string | null
): Promise<{ id: string; name: string | null; phone: string | null } | null> {
  const trimmed = phoneInput.trim()
  if (!trimmed) return null
  const normalized = normalizePhoneNumber(trimmed)

  const candidatePatterns = new Set<string>()
  candidatePatterns.add(trimmed)
  candidatePatterns.add(normalized)

  let last10 = ''
  if (normalized.startsWith('01') && normalized.length === 11) {
    last10 = normalized.slice(1) // 10 digits, e.g. 1891787808
    candidatePatterns.add(`+880${last10}`)
    candidatePatterns.add(`880${last10}`)
    candidatePatterns.add(`+88${last10}`)
    candidatePatterns.add(`88${last10}`)
    candidatePatterns.add(`0${last10}`)
    candidatePatterns.add(last10)
    candidatePatterns.add(`+88 0${last10}`)
    candidatePatterns.add(`+88 ${last10}`)
    candidatePatterns.add(`+880 ${last10}`)
  }

  // Fetch all leads that have a phone set
  const whereClauses: any[] = [
    sql`${schema.campaignLeads.phone} IS NOT NULL`,
    ne(schema.campaignLeads.phone, ''),
  ]
  if (excludeLeadId) {
    whereClauses.push(ne(schema.campaignLeads.id, excludeLeadId))
  }

  const leads = await db
    .select({
      id: schema.campaignLeads.id,
      name: schema.campaignLeads.name,
      phone: schema.campaignLeads.phone,
      normalizedPhone: schema.campaignLeads.normalizedPhone,
    })
    .from(schema.campaignLeads)
    .where(and(...whereClauses))

  for (const lead of leads) {
    const raw = (lead.phone || '').trim()
    const norm = (lead.normalizedPhone || '').trim() || normalizePhoneNumber(raw)

    // Direct match on normalized representation
    if (norm && norm === normalized) {
      return lead
    }

    // Direct match on candidate patterns
    if (candidatePatterns.has(raw) || candidatePatterns.has(norm)) {
      return lead
    }

    // 10-digit suffix match for Bangladesh numbers
    if (last10) {
      const rawDigits = raw.replace(/\D/g, '')
      if (rawDigits.endsWith(last10)) {
        return lead
      }
    }
  }

  return null
}

/**
 * Shared filter conditions builder for campaign leads list and export
 */
function buildLeadFilterConditions({
  search,
  status,
  country,
  startDate,
  endDate,
}: {
  search?: string
  status?: string
  country?: string
  startDate?: string
  endDate?: string
}) {
  const conditions: any[] = []

  if (status && status !== 'ALL') {
    conditions.push(eq(schema.campaignLeads.status, status))
  }

  if (country && country !== 'ALL') {
    const trimmedCountry = country.trim()
    if (trimmedCountry === 'United States' || trimmedCountry === 'USA') {
      conditions.push(
        or(
          eq(schema.campaignLeads.interestedCountry, 'United States'),
          eq(schema.campaignLeads.interestedCountry, 'USA')
        )
      )
    } else if (trimmedCountry === 'United Kingdom' || trimmedCountry === 'UK') {
      conditions.push(
        or(
          eq(schema.campaignLeads.interestedCountry, 'United Kingdom'),
          eq(schema.campaignLeads.interestedCountry, 'UK')
        )
      )
    } else {
      conditions.push(eq(schema.campaignLeads.interestedCountry, trimmedCountry))
    }
  }

  // Consistent, reliable calendar-day date filtering in Bangladesh Time (UTC+6)
  const leadDateSql = sql`COALESCE(DATE(CONVERT_TZ(${schema.campaignLeads.createdAt}, '+00:00', '+06:00')), DATE(${schema.campaignLeads.createdAt}))`

  if (startDate) {
    const cleanStart = startDate.split('T')[0].trim()
    if (cleanStart) {
      conditions.push(sql`${leadDateSql} >= ${cleanStart}`)
    }
  }

  if (endDate) {
    const cleanEnd = endDate.split('T')[0].trim()
    if (cleanEnd) {
      conditions.push(sql`${leadDateSql} <= ${cleanEnd}`)
    }
  }

  if (search && search.trim() !== '') {
    const rawTerm = search.trim()
    const term = `%${rawTerm}%`
    const searchConditions: any[] = [
      like(schema.campaignLeads.name, term),
      like(schema.campaignLeads.email, term),
      like(schema.campaignLeads.phone, term),
      like(schema.campaignLeads.normalizedPhone, term),
      like(schema.campaignLeads.interestedProgram, term),
      like(schema.campaignLeads.interestedCountry, term),
      like(schema.campaignLeads.intakeYear, term),
      like(schema.campaignLeads.reason, term),
      like(schema.campaignLeads.id, term),
      like(schema.campaignLeads.utmSource, term),
      like(schema.campaignLeads.utmCampaign, term),
    ]

    // Phone digits and normalized matching for various input formats (+880, spaces, dashes)
    const digitsOnly = rawTerm.replace(/\D/g, '')
    if (digitsOnly.length >= 3) {
      searchConditions.push(like(schema.campaignLeads.phone, `%${digitsOnly}%`))
      searchConditions.push(like(schema.campaignLeads.normalizedPhone, `%${digitsOnly}%`))
    }

    const normPhone = normalizePhoneNumber(rawTerm)
    if (normPhone && normPhone !== digitsOnly) {
      searchConditions.push(like(schema.campaignLeads.phone, `%${normPhone}%`))
      searchConditions.push(like(schema.campaignLeads.normalizedPhone, `%${normPhone}%`))
    }

    if (normPhone.startsWith('01') && normPhone.length === 11) {
      const last10 = normPhone.slice(1)
      searchConditions.push(like(schema.campaignLeads.phone, `%${last10}%`))
      searchConditions.push(like(schema.campaignLeads.normalizedPhone, `%${last10}%`))
    }

    conditions.push(or(...searchConditions))
  }

  return conditions
}

export const campaignRouter = createTRPCRouter({
  /**
   * Real-time duplicate phone validation for campaign form.
   */
  checkPhone: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        leadId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const trimmed = input.phone.trim()
      if (!trimmed || trimmed.length < 6) {
        return { isDuplicate: false }
      }
      const duplicate = await findDuplicatePhoneLead(trimmed, input.leadId)
      if (duplicate) {
        return {
          isDuplicate: true,
          message: 'This phone is already submitted.',
        }
      }
      return { isDuplicate: false }
    }),

  /**
   * Progressive save endpoint for multi-step campaign lead capture.
   * Can create a lead at step 1 and update at each subsequent step.
   * Enforces phone number format and duplicate check.
   */
  saveStep: publicProcedure
    .input(
      z.object({
        leadId: z.string().optional(),
        step: z.number().int().min(1).max(6),
        name: z.string().max(255).optional(),
        email: z.string().max(255).optional(),
        phone: z.string().max(50).optional(),
        interestedProgram: z.string().max(255).optional(),
        interestedCountry: z.string().max(255).optional(),
        intakeYear: z.string().max(50).optional(),
        reason: z.string().max(5000).optional(),
        utmSource: z.string().max(100).optional(),
        utmMedium: z.string().max(100).optional(),
        utmCampaign: z.string().max(100).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        leadId,
        step,
        name,
        email,
        phone,
        interestedProgram,
        interestedCountry,
        intakeYear,
        reason,
        utmSource,
        utmMedium,
        utmCampaign,
      } = input

      // Extract client IP and User Agent if available from headers
      const clientIp =
        ctx.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        ctx.headers?.get('x-real-ip') ||
        null
      const userAgent = ctx.headers?.get('user-agent')?.slice(0, 500) || null

      const isCompleted = step === 6

      // Phone validation & normalization & duplicate prevention
      let normalizedPhone: string | null = null
      if (phone !== undefined && phone.trim() !== '') {
        const trimmedPhone = phone.trim()
        normalizedPhone = normalizePhoneNumber(trimmedPhone)

        // Validate format for Bangladesh numbers (must be 11 digits starting with 01)
        if (normalizedPhone.startsWith('01')) {
          if (normalizedPhone.length !== 11) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Please enter a valid 11-digit phone number (e.g. 01891787808)',
            })
          }
        } else if (normalizedPhone.length < 7) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Please enter a valid phone number with at least 7 digits',
          })
        }

        // Duplicate Check: ensure no other lead already has this phone
        const existingDuplicate = await findDuplicatePhoneLead(trimmedPhone, leadId)
        if (existingDuplicate) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'This phone is already submitted.',
          })
        }
      }

      if (leadId) {
        // Find existing lead
        const existing = await db
          .select()
          .from(schema.campaignLeads)
          .where(eq(schema.campaignLeads.id, leadId))
          .limit(1)

        if (existing.length > 0) {
          const currentLead = existing[0]

          // If current lead is already marked completed, block reuse
          if (currentLead.status === 'COMPLETED') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'This phone is already submitted.',
            })
          }

          const updatePayload: Record<string, any> = {
            completedStep: Math.max(currentLead.completedStep || 1, step),
            updatedAt: new Date(),
          }

          if (name !== undefined && name !== '') updatePayload.name = name.trim()
          if (email !== undefined && email !== '') updatePayload.email = email.trim()
          if (phone !== undefined && phone !== '') {
            updatePayload.phone = phone.trim()
            updatePayload.normalizedPhone = normalizedPhone
          }
          if (interestedProgram !== undefined && interestedProgram !== '')
            updatePayload.interestedProgram = interestedProgram.trim()
          if (interestedCountry !== undefined && interestedCountry !== '')
            updatePayload.interestedCountry = interestedCountry.trim()
          if (intakeYear !== undefined && intakeYear !== '')
            updatePayload.intakeYear = intakeYear.trim()
          if (reason !== undefined) updatePayload.reason = reason.trim()

          // If step 6 is completed and was previously PARTIAL, upgrade to COMPLETED
          if (isCompleted && currentLead.status === 'PARTIAL') {
            updatePayload.status = 'COMPLETED'
          }

          if (utmSource && !currentLead.utmSource) updatePayload.utmSource = utmSource
          if (utmMedium && !currentLead.utmMedium) updatePayload.utmMedium = utmMedium
          if (utmCampaign && !currentLead.utmCampaign) updatePayload.utmCampaign = utmCampaign
          if (clientIp && !currentLead.ipAddress) updatePayload.ipAddress = clientIp
          if (userAgent && !currentLead.userAgent) updatePayload.userAgent = userAgent

          await db
            .update(schema.campaignLeads)
            .set(updatePayload)
            .where(eq(schema.campaignLeads.id, leadId))

          return {
            success: true,
            leadId,
            step,
            isCompleted,
          }
        }
      }

      // If no leadId or not found, create new row
      const newId = genId()
      await db.insert(schema.campaignLeads).values({
        id: newId,
        name: name ? name.trim() : null,
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        normalizedPhone: normalizedPhone,
        interestedProgram: interestedProgram ? interestedProgram.trim() : null,
        interestedCountry: interestedCountry ? interestedCountry.trim() : null,
        intakeYear: intakeYear ? intakeYear.trim() : null,
        reason: reason ? reason.trim() : null,
        completedStep: step,
        status: isCompleted ? 'COMPLETED' : 'PARTIAL',
        utmSource: utmSource || 'qr-campaign',
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        ipAddress: clientIp,
        userAgent: userAgent,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return {
        success: true,
        leadId: newId,
        step,
        isCompleted,
      }
    }),

  /**
   * Retrieve lead progress for an existing session
   */
  getLead: publicProcedure
    .input(z.object({ leadId: z.string() }))
    .query(async ({ input }) => {
      const rows = await db
        .select()
        .from(schema.campaignLeads)
        .where(eq(schema.campaignLeads.id, input.leadId))
        .limit(1)

      if (rows.length === 0) return null
      return rows[0]
    }),

  /**
   * Super Admin & Admin: List campaign leads with search, filters, pagination
   */
  list: adminWithPermission('campaign:view')
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(['ALL', 'PARTIAL', 'COMPLETED', 'CONTACTED', 'CONVERTED', 'ARCHIVED']).optional(),
        country: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(200).default(50),
      })
    )
    .query(async ({ input }) => {
      const { search, status, country, startDate, endDate, page, limit } = input
      const offset = (page - 1) * limit

      const conditions = buildLeadFilterConditions({
        search,
        status,
        country,
        startDate,
        endDate,
      })

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const [leads, countResult] = await Promise.all([
        db
          .select()
          .from(schema.campaignLeads)
          .where(whereClause)
          .orderBy(desc(schema.campaignLeads.createdAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ total: count() })
          .from(schema.campaignLeads)
          .where(whereClause),
      ])

      const totalCount = Number(countResult[0]?.total || 0)

      return {
        leads,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit) || 1,
      }
    }),

  /**
   * Super Admin & Admin: Summary stats for campaign performance
   */
  stats: adminWithPermission('campaign:view')
    .input(
      z
        .object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .optional()
    )
    .query(async () => {
      // Calculate metrics across leads
      const allLeads = await db
        .select({
          id: schema.campaignLeads.id,
          status: schema.campaignLeads.status,
          completedStep: schema.campaignLeads.completedStep,
          interestedCountry: schema.campaignLeads.interestedCountry,
          interestedProgram: schema.campaignLeads.interestedProgram,
          createdAt: schema.campaignLeads.createdAt,
        })
        .from(schema.campaignLeads)

      const now = new Date()
      // Current calendar date in Bangladesh (+06:00)
      const bdNow = new Date(now.getTime() + 6 * 60 * 60 * 1000)
      const todayBdStr = bdNow.toISOString().slice(0, 10)

      let completed = 0
      let partial = 0
      let contacted = 0
      let converted = 0
      let todayCount = 0

      const countryCounts: Record<string, number> = {}
      const programCounts: Record<string, number> = {}

      for (const lead of allLeads) {
        if (lead.status === 'PARTIAL') {
          partial++
        } else {
          completed++
        }

        if (lead.status === 'CONTACTED') contacted++
        if (lead.status === 'CONVERTED') converted++

        if (lead.createdAt) {
          const leadBdStr = new Date(new Date(lead.createdAt).getTime() + 6 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10)
          if (leadBdStr === todayBdStr) {
            todayCount++
          }
        }

        if (lead.interestedCountry) {
          countryCounts[lead.interestedCountry] = (countryCounts[lead.interestedCountry] || 0) + 1
        }
        if (lead.interestedProgram) {
          programCounts[lead.interestedProgram] = (programCounts[lead.interestedProgram] || 0) + 1
        }
      }

      const total = allLeads.length
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

      return {
        total,
        completed,
        partial,
        contacted,
        converted,
        todayCount,
        completionRate,
        topCountries: Object.entries(countryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([country, cnt]) => ({ country, count: cnt })),
        topPrograms: Object.entries(programCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([program, cnt]) => ({ program, count: cnt })),
      }
    }),

  /**
   * Super Admin & Admin: Export leads for CSV / Excel download
   */
  exportData: adminWithPermission('campaign:view')
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(['ALL', 'PARTIAL', 'COMPLETED', 'CONTACTED', 'CONVERTED', 'ARCHIVED']).optional(),
        country: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const conditions = buildLeadFilterConditions(input)
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      return db
        .select()
        .from(schema.campaignLeads)
        .where(whereClause)
        .orderBy(desc(schema.campaignLeads.createdAt))
        .limit(5000)
    }),

  /**
   * Super Admin & Admin: Update lead status (CONTACTED, CONVERTED, ARCHIVED, etc.)
   */
  updateStatus: adminWithPermission('campaign:manage')
    .input(
      z.object({
        id: z.string(),
        status: z.enum(['PARTIAL', 'COMPLETED', 'CONTACTED', 'CONVERTED', 'ARCHIVED']),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(schema.campaignLeads)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(schema.campaignLeads.id, input.id))

      return { success: true }
    }),

  /**
   * Super Admin & Admin: Delete lead
   */
  delete: adminWithPermission('campaign:manage')
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(schema.campaignLeads).where(eq(schema.campaignLeads.id, input.id))
      return { success: true }
    }),

  /**
   * Super Admin & Admin: Manually create lead from panel
   */
  createManual: adminWithPermission('campaign:manage')
    .input(
      z.object({
        name: z.string().min(1, 'Name is required').max(255),
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().optional(),
        interestedProgram: z.string().optional(),
        interestedCountry: z.string().optional(),
        intakeYear: z.string().optional(),
        reason: z.string().optional(),
        status: z.enum(['PARTIAL', 'COMPLETED', 'CONTACTED', 'CONVERTED', 'ARCHIVED']).default('COMPLETED'),
      })
    )
    .mutation(async ({ input }) => {
      let normalizedPhone: string | null = null
      if (input.phone && input.phone.trim() !== '') {
        normalizedPhone = normalizePhoneNumber(input.phone.trim())

        const duplicate = await findDuplicatePhoneLead(input.phone.trim())
        if (duplicate) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'This phone is already submitted.',
          })
        }
      }

      const newId = genId()
      await db.insert(schema.campaignLeads).values({
        id: newId,
        name: input.name.trim(),
        email: input.email ? input.email.trim() : null,
        phone: input.phone ? input.phone.trim() : null,
        normalizedPhone: normalizedPhone,
        interestedProgram: input.interestedProgram || null,
        interestedCountry: input.interestedCountry || null,
        intakeYear: input.intakeYear || null,
        reason: input.reason || null,
        completedStep: 6,
        status: input.status,
        utmSource: 'admin-manual',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return { success: true, leadId: newId }
    }),
})
