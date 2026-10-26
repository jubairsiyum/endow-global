import { db, schema } from '@/lib/db'
import { randomUUID } from 'crypto'
import {
  and as _and,
  desc as _desc,
  eq as _eq,
  inArray as _inArray,
  or as _or,
  sql as _sql,
} from 'drizzle-orm'
const eq = _eq as any
const sql = _sql as any
const desc = _desc as any
const and = _and as any
const or = _or as any
const inArray = _inArray as any

function parseInquiryIdFromApp(app: any): string | null {
  if (!app) return null
  if (app.counselorNotes && app.counselorNotes.includes('__inq_')) {
    const match = app.counselorNotes.match(/__inq_([a-zA-Z0-9-]+)/)
    if (match?.[1]) return match[1]
  }
  if (!app.personalInfo) return null
  try {
    const p = typeof app.personalInfo === 'string' ? JSON.parse(app.personalInfo) : app.personalInfo
    return p?.inquiryId || null
  } catch {
    return null
  }
}

export async function syncStudentInquiriesToApplications(
  dbInstance: typeof db,
  user: { id: string; email?: string | null; name?: string | null; image?: string | null },
  existingProfile?: any
) {
  if (!user?.id) return { profile: existingProfile, syncedCount: 0 }

  // 1. Ensure student profile exists
  let profile = existingProfile
  if (!profile || !profile.id) {
    const [p] = await dbInstance
      .select()
      .from(schema.studentProfiles)
      .where(eq(schema.studentProfiles.userId, user.id))
      .limit(1)
    profile = p
  }

  if (!profile) {
    const profileId = randomUUID().replace(/-/g, '').slice(0, 24)
    await dbInstance.insert(schema.studentProfiles).values({
      id: profileId,
      userId: user.id,
      targetCountries: ['South Korea'],
      highestEducation: 'HIGH_SCHOOL',
    } as any)
    const [created] = await dbInstance
      .select()
      .from(schema.studentProfiles)
      .where(eq(schema.studentProfiles.id, profileId))
      .limit(1)
    profile = created
  }

  // 2. Find any inquiries matching user.id or user.email
  const conditions = [eq(schema.studentInquiries.userId, user.id)]
  if (user.email) {
    conditions.push(eq(schema.studentInquiries.email, user.email.trim()))
  }

  const inquiries = await dbInstance
    .select()
    .from(schema.studentInquiries)
    .where(or(...conditions))
    .orderBy(desc(schema.studentInquiries.submittedAt))

  if (inquiries.length === 0) {
    return { profile, syncedCount: 0 }
  }

  // Ensure inquiries have userId set
  for (const inq of inquiries) {
    if (!inq.userId) {
      await dbInstance
        .update(schema.studentInquiries)
        .set({ userId: user.id })
        .where(eq(schema.studentInquiries.id, inq.id))
        .catch(() => {})
    }
  }

  // 3. Update student profile signals from latest inquiry
  const latestInq = inquiries[0]
  if (latestInq) {
    const profileUpdates: Record<string, any> = {}

    // Update user profile picture and name if not set
    if (user.id) {
      const userUpdates: Record<string, any> = {}
      if (latestInq.photoUrl && !user.image) {
        userUpdates.image = latestInq.photoUrl
      }
      const fullName = `${latestInq.givenName || ''} ${latestInq.surname || ''}`.trim()
      if (
        fullName &&
        (!user.name || user.name === 'User' || user.name === user.email?.split('@')[0])
      ) {
        userUpdates.name = fullName
      }
      if (Object.keys(userUpdates).length > 0) {
        await dbInstance
          .update(schema.users)
          .set(userUpdates)
          .where(eq(schema.users.id, user.id))
          .catch(() => {})
      }
    }

    // Map education level
    let highestEducation = profile.highestEducation
    if (latestInq.applyingTo === 'Masters') highestEducation = 'BACHELORS'
    else if (latestInq.applyingTo === 'Doctorate') highestEducation = 'MASTERS'
    else if (
      latestInq.applyingTo === 'Undergraduate' ||
      latestInq.applyingTo === 'EAP' ||
      latestInq.applyingTo === 'KLP'
    )
      highestEducation = 'HIGH_SCHOOL'

    if (highestEducation && highestEducation !== profile.highestEducation) {
      profileUpdates.highestEducation = highestEducation
    }

    if (latestInq.targetCountry) {
      let currentTargets: string[] = []
      try {
        currentTargets = Array.isArray(profile.targetCountries)
          ? profile.targetCountries
          : JSON.parse(profile.targetCountries || '[]')
      } catch {
        currentTargets = []
      }
      if (!currentTargets.includes(latestInq.targetCountry)) {
        profileUpdates.targetCountries = [latestInq.targetCountry, ...currentTargets]
      }
    }

    const gpaVal = latestInq.bachelorsResult
      ? parseFloat(latestInq.bachelorsResult)
      : latestInq.mastersResult
        ? parseFloat(latestInq.mastersResult)
        : latestInq.hscResult
          ? parseFloat(latestInq.hscResult)
          : latestInq.sscResult
            ? parseFloat(latestInq.sscResult)
            : null
    if (gpaVal != null && !isNaN(gpaVal)) {
      profileUpdates.gpa = gpaVal
    }

    const ieltsVal = latestInq.ieltsScore ? parseFloat(latestInq.ieltsScore) : null
    if (ieltsVal != null && !isNaN(ieltsVal)) {
      profileUpdates.ieltsScore = ieltsVal
    }

    const toeflVal = latestInq.toeflScore ? parseInt(latestInq.toeflScore) : null
    if (toeflVal != null && !isNaN(toeflVal)) {
      profileUpdates.toeflScore = toeflVal
    }

    const satVal = latestInq.satScore ? parseInt(latestInq.satScore) : null
    if (satVal != null && !isNaN(satVal)) {
      profileUpdates.satScore = satVal
    }

    if (latestInq.phone && latestInq.phone.trim()) {
      profileUpdates.phone = latestInq.phone.trim()
    }
    if (latestInq.nationality && latestInq.nationality.trim()) {
      profileUpdates.nationality = latestInq.nationality.trim()
    }
    if (latestInq.country && latestInq.country.trim()) {
      profileUpdates.countryOfResidence = latestInq.country.trim()
    }

    const updatedProfile = { ...profile, ...profileUpdates }
    const completionPercent = Math.min(
      Math.round(
        ([
          user.name || `${latestInq.givenName || ''} ${latestInq.surname || ''}`.trim(),
          updatedProfile.nationality,
          updatedProfile.countryOfResidence,
          updatedProfile.phone,
          updatedProfile.highestEducation,
          updatedProfile.gpa != null && Number(updatedProfile.gpa) > 0,
          (updatedProfile.ieltsScore != null && Number(updatedProfile.ieltsScore) > 0) ||
            (updatedProfile.toeflScore != null && Number(updatedProfile.toeflScore) > 0) ||
            (updatedProfile.satScore != null && Number(updatedProfile.satScore) > 0),
          Array.isArray(updatedProfile.targetCountries) && updatedProfile.targetCountries.length > 0,
          user.image || latestInq.photoUrl,
        ].filter(Boolean).length /
          9) *
          100
      ),
      100
    )
    profileUpdates.completionPercent = completionPercent

    if (Object.keys(profileUpdates).length > 0) {
      await dbInstance
        .update(schema.studentProfiles)
        .set(profileUpdates)
        .where(eq(schema.studentProfiles.id, profile.id))
        .catch(() => {})

      profile = { ...profile, ...profileUpdates }
    }
  }

  // 4. Ensure an application row exists for each inquiry (Strict 1:1 mapping)
  let syncedCount = 0
  const existingApps = await dbInstance
    .select({
      id: schema.applications.id,
      courseId: schema.applications.courseId,
      personalInfo: schema.applications.personalInfo,
      counselorNotes: schema.applications.counselorNotes,
    })
    .from(schema.applications)
    .where(eq(schema.applications.studentId, profile.id))

  // Clean up any historical duplicate applications if applications exceed inquiries
  if (existingApps.length > inquiries.length && inquiries.length > 0) {
    const validInqIds = new Set(inquiries.map((i) => i.id))
    const keptAppIds = new Set<string>()

    for (const inq of inquiries) {
      const match = existingApps.find((a) => {
        if (keptAppIds.has(a.id)) return false
        const inqId = parseInquiryIdFromApp(a)
        return inqId === inq.id
      })
      if (match) {
        keptAppIds.add(match.id)
      } else {
        const fallbackMatch = existingApps.find((a) => !keptAppIds.has(a.id))
        if (fallbackMatch) keptAppIds.add(fallbackMatch.id)
      }
    }

    const excessApps = existingApps.filter((a) => !keptAppIds.has(a.id))
    if (excessApps.length > 0) {
      await dbInstance
        .delete(schema.applications)
        .where(inArray(schema.applications.id, excessApps.map((a) => a.id)))
        .catch(() => {})
      
      // Update local array
      for (let i = existingApps.length - 1; i >= 0; i--) {
        if (!keptAppIds.has(existingApps[i].id)) {
          existingApps.splice(i, 1)
        }
      }
    }
  }

  for (const inq of inquiries) {
    // If this inquiry was already converted to an application, skip it
    const alreadySynced = existingApps.some(
      (a) => parseInquiryIdFromApp(a) === inq.id
    )
    if (alreadySynced) {
      continue
    }

    // Only convert inquiries that represent an actual course application
    const hasAppSignals = Boolean(inq.courseSlug) || Boolean(inq.courseName) || Boolean(inq.targetUniversity);
    if (!hasAppSignals) {
      continue;
    }

    // Do not create more applications than inquiries
    if (existingApps.length >= inquiries.length) {
      break
    }

    let course: { id: string; name?: string } | undefined

    // 1) Match by slug
    if (inq.courseSlug) {
      const [c] = await dbInstance
        .select({ id: schema.courses.id, name: schema.courses.name })
        .from(schema.courses)
        .where(eq(schema.courses.slug, inq.courseSlug))
        .limit(1)
      course = c
    }

    // 2) Match by course name (exact or substring)
    if (!course && inq.courseName) {
      const cName = inq.courseName.trim()
      const [c] = await dbInstance
        .select({ id: schema.courses.id, name: schema.courses.name })
        .from(schema.courses)
        .where(
          or(
            eq(schema.courses.name, cName),
            sql`${schema.courses.name} LIKE ${'%' + cName + '%'}`
          )
        )
        .limit(1)
      course = c
    }

    // 3) Match by target university + degree level
    if (!course && inq.targetUniversity) {
      const [uni] = await dbInstance
        .select({ id: schema.universities.id, name: schema.universities.name })
        .from(schema.universities)
        .where(
          or(
            eq(schema.universities.name, inq.targetUniversity),
            sql`${schema.universities.name} LIKE ${'%' + inq.targetUniversity + '%'}`
          )
        )
        .limit(1)

      if (uni) {
        const levelPref =
          inq.applyingTo === 'Masters'
            ? 'POSTGRADUATE'
            : inq.applyingTo === 'Doctorate'
              ? 'PHD'
              : 'UNDERGRADUATE'

        const [cByLevel] = await dbInstance
          .select({ id: schema.courses.id, name: schema.courses.name })
          .from(schema.courses)
          .where(
            and(
              eq(schema.courses.universityId, uni.id),
              eq(schema.courses.level, levelPref)
            )
          )
          .limit(1)

        course = cByLevel

        if (!course) {
          const [anyC] = await dbInstance
            .select({ id: schema.courses.id, name: schema.courses.name })
            .from(schema.courses)
            .where(eq(schema.courses.universityId, uni.id))
            .limit(1)
          course = anyC
        }
      }
    }

    // 4) Match by target country
    if (!course) {
      const targetCountry = inq.targetCountry || 'South Korea'
      const [cCountry] = await dbInstance
        .select({ id: schema.courses.id, name: schema.courses.name })
        .from(schema.courses)
        .leftJoin(schema.universities, eq(schema.universities.id, schema.courses.universityId))
        .where(
          and(
            eq(schema.courses.isActive, true),
            or(
              eq(schema.universities.country, targetCountry),
              sql`${schema.universities.country} LIKE ${'%' + targetCountry + '%'}`
            )
          )
        )
        .limit(1)
      course = cCountry
    }

    // 5) Ultimate active course fallback
    if (!course) {
      const [anyActive] = await dbInstance
        .select({ id: schema.courses.id, name: schema.courses.name })
        .from(schema.courses)
        .where(eq(schema.courses.isActive, true))
        .limit(1)
      course = anyActive
    }

    if (course) {
      let matchedCourseId = course.id
      const alreadyHasCourse = existingApps.some((a) => a.courseId === matchedCourseId)

      if (alreadyHasCourse) {
        const appliedIds = existingApps.map((a) => a.courseId).filter(Boolean)
        const allActive = await dbInstance
          .select({ id: schema.courses.id, name: schema.courses.name })
          .from(schema.courses)
          .where(eq(schema.courses.isActive, true))
          .limit(25)
        const alt = allActive.find((c) => !appliedIds.includes(c.id))
        if (alt) matchedCourseId = alt.id
      }

      const appId = randomUUID().replace(/-/g, '').slice(0, 24)
      const personalInfoObj = {
        inquiryId: inq.id,
        surname: inq.surname,
        givenName: inq.givenName,
        email: inq.email,
        phone: inq.phone,
        whatsapp: inq.whatsapp,
        gender: inq.gender,
        dob: inq.dob,
        country: inq.country,
        nationality: inq.nationality,
        addressLine1: inq.addressLine1,
        addressLine2: inq.addressLine2,
        city: inq.city,
        state: inq.state,
        zipCode: inq.zipCode,
        photoUrl: inq.photoUrl,
      }

      const cNotes = [
        `__inq_${inq.id}`,
        inq.reasonToChoose ? `Reason to choose: ${inq.reasonToChoose}` : null,
        inq.targetUniversity ? `Target University: ${inq.targetUniversity}` : null,
      ].filter(Boolean).join(' | ')

      await dbInstance.insert(schema.applications).values({
        id: appId,
        studentId: profile.id,
        courseId: matchedCourseId,
        status: 'SUBMITTED',
        currentStep: 5,
        totalSteps: 5,
        submittedAt: inq.submittedAt || new Date(),
        personalInfo: personalInfoObj,
        academicHistory: {
          applyingTo: inq.applyingTo,
          sscYear: inq.sscYear,
          sscResult: inq.sscResult,
          hscYear: inq.hscYear,
          hscResult: inq.hscResult,
          bachelorsYear: inq.bachelorsYear,
          bachelorsResult: inq.bachelorsResult,
          mastersYear: inq.mastersYear,
          mastersResult: inq.mastersResult,
          englishTest: inq.englishTest,
          ieltsScore: inq.ieltsScore,
          toeflScore: inq.toeflScore,
          satScore: inq.satScore,
          topikLevel: inq.topikLevel,
          targetUniversity: inq.targetUniversity,
          targetCountry: inq.targetCountry,
        },
        counselorNotes: cNotes,
      })

      existingApps.push({
        id: appId,
        courseId: matchedCourseId,
        personalInfo: personalInfoObj,
        counselorNotes: cNotes,
      })
      syncedCount++
    }
  }

  return { profile, syncedCount }
}
