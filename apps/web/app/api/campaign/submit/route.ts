import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@endow/db'
import { eq as _eq, or as _or, and as _and, ne as _ne } from 'drizzle-orm'
import { normalizePhoneNumber, findDuplicatePhoneLead } from '@/server/routers/campaign'

const eq = _eq as any
const or = _or as any
const and = _and as any
const ne = _ne as any

function genId() {
  return globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 25)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      leadId,
      step = 1,
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
    } = body

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      null
    const userAgent = req.headers.get('user-agent')?.slice(0, 500) || null
    const isCompleted = step === 6

    // Phone normalization & duplicate check
    let normalizedPhone: string | null = null
    if (phone && String(phone).trim() !== '') {
      const trimmedPhone = String(phone).trim()
      normalizedPhone = normalizePhoneNumber(trimmedPhone)

      if (normalizedPhone.startsWith('01') && normalizedPhone.length !== 11) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid 11-digit phone number (e.g. 01891787808)' },
          { status: 400 }
        )
      }

      const existingDuplicate = await findDuplicatePhoneLead(trimmedPhone, leadId)
      if (existingDuplicate) {
        return NextResponse.json(
          {
            success: false,
            error: 'This phone is already submitted.',
          },
          { status: 409 }
        )
      }
    }

    if (leadId) {
      const existing = await db
        .select()
        .from(schema.campaignLeads)
        .where(eq(schema.campaignLeads.id, leadId))
        .limit(1)

      if (existing.length > 0) {
        const currentLead = existing[0]
        const updatePayload: Record<string, any> = {
          completedStep: Math.max(currentLead.completedStep || 1, Number(step)),
          updatedAt: new Date(),
        }

        if (name) updatePayload.name = String(name).trim()
        if (email) updatePayload.email = String(email).trim()
        if (phone) {
          updatePayload.phone = String(phone).trim()
          updatePayload.normalizedPhone = normalizedPhone
        }
        if (interestedProgram) updatePayload.interestedProgram = String(interestedProgram).trim()
        if (interestedCountry) updatePayload.interestedCountry = String(interestedCountry).trim()
        if (intakeYear) updatePayload.intakeYear = String(intakeYear).trim()
        if (reason) updatePayload.reason = String(reason).trim()

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

        return NextResponse.json({ success: true, leadId, step, isCompleted })
      }
    }

    const newId = genId()
    await db.insert(schema.campaignLeads).values({
      id: newId,
      name: name ? String(name).trim() : null,
      email: email ? String(email).trim() : null,
      phone: phone ? String(phone).trim() : null,
      normalizedPhone: normalizedPhone,
      interestedProgram: interestedProgram ? String(interestedProgram).trim() : null,
      interestedCountry: interestedCountry ? String(interestedCountry).trim() : null,
      intakeYear: intakeYear ? String(intakeYear).trim() : null,
      reason: reason ? String(reason).trim() : null,
      completedStep: Number(step),
      status: isCompleted ? 'COMPLETED' : 'PARTIAL',
      utmSource: utmSource || 'qr-campaign',
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      ipAddress: clientIp,
      userAgent: userAgent,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, leadId: newId, step, isCompleted })
  } catch (error: any) {
    console.error('Campaign lead submit error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    )
  }
}
