import { db, schema } from '@/lib/db'
import { randomUUID } from 'crypto'
import {
  and as _and,
  desc as _desc,
  eq as _eq,
  or as _or,
  sql as _sql,
} from 'drizzle-orm'
const eq = _eq as any
const sql = _sql as any
const desc = _desc as any
const and = _and as any
const or = _or as any

export async function syncStudentInquiriesToApplications(
  dbInstance: typeof db,
  user: { id: string; email?: string | null; name?: string | null },
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
      highestEducation: 'BACHELORS',
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

    // Map education level
    let highestEducation = profile.highestEducation
    if (latestInq.applyingTo === 'Masters') highestEducation = 'BACHELORS'
    else if (latestInq.applyingTo === 'Doctorate') highestEducation = 'MASTERS'
    else if (latestInq.applyingTo === 'Undergraduate') highestEducation = 'HIGH_SCHOOL'

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
      : latestInq.hscResult
        ? parseFloat(latestInq.hscResult)
        : null
    if (gpaVal && !isNaN(gpaVal) && !profile.gpa) {
      profileUpdates.gpa = gpaVal
    }

    const ieltsVal = latestInq.ieltsScore ? parseFloat(latestInq.ieltsScore) : null
    if (ieltsVal && !isNaN(ieltsVal) && !profile.ieltsScore) {
      profileUpdates.ieltsScore = ieltsVal
    }

    const toeflVal = latestInq.toeflScore ? parseInt(latestInq.toeflScore) : null
    if (toeflVal && !isNaN(toeflVal) && !profile.toeflScore) {
      profileUpdates.toeflScore = toeflVal
    }

    const satVal = latestInq.satScore ? parseInt(latestInq.satScore) : null
    if (satVal && !isNaN(satVal) && !profile.satScore) {
      profileUpdates.satScore = satVal
    }

    if (latestInq.phone && !profile.phone) {
      profileUpdates.phone = latestInq.phone
    }
    if (latestInq.nationality && !profile.nationality) {
      profileUpdates.nationality = latestInq.nationality
    }
    if (latestInq.country && !profile.countryOfResidence) {
      profileUpdates.countryOfResidence = latestInq.country
    }

    if (Object.keys(profileUpdates).length > 0) {
      await dbInstance
        .update(schema.studentProfiles)
        .set(profileUpdates)
        .where(eq(schema.studentProfiles.id, profile.id))
        .catch(() => {})

      profile = { ...profile, ...profileUpdates }
    }
  }

  // 4. Ensure an application row exists for each inquiry
  let syncedCount = 0
  for (const inq of inquiries) {
    const existingApps = await dbInstance
      .select({ id: schema.applications.id, courseId: schema.applications.courseId })
      .from(schema.applications)
      .where(eq(schema.applications.studentId, profile.id))

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

    // 2) Match by course name
    if (!course && inq.courseName) {
      const [c] = await dbInstance
        .select({ id: schema.courses.id, name: schema.courses.name })
        .from(schema.courses)
        .where(eq(schema.courses.name, inq.courseName))
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
      const alreadyCreated = existingApps.some((a) => a.courseId === course!.id)
      if (!alreadyCreated) {
        const appId = randomUUID().replace(/-/g, '').slice(0, 24)
        await dbInstance.insert(schema.applications).values({
          id: appId,
          studentId: profile.id,
          courseId: course.id,
          status: 'SUBMITTED',
          currentStep: 5,
          totalSteps: 5,
          submittedAt: inq.submittedAt || new Date(),
          personalInfo: {
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
          },
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
          counselorNotes: inq.reasonToChoose
            ? `Reason to choose: ${inq.reasonToChoose}`
            : inq.targetUniversity
              ? `Target University: ${inq.targetUniversity}`
              : null,
          createdAt: inq.submittedAt || new Date(),
          updatedAt: inq.submittedAt || new Date(),
        } as any)
        syncedCount++
      }
    }
  }

  return { profile, syncedCount }
}
