import '../../../../env-loader.cjs'
import { db, schema } from '../..'
import { eq } from 'drizzle-orm'
import { hash } from 'bcryptjs'

type SeedUser = {
  email: string
  name: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'COUNSELOR' | 'STUDENT'
  password: string
  permissions?: string[]
  counselorProfile?: {
    bio?: string
    expertiseCountries?: string[]
    expertiseSubjects?: string[]
    languages?: string[]
  }
  studentProfile?: {
    nationality?: string
    targetCountries?: string[]
  }
}

const USERS: SeedUser[] = [
  // ─── Core ───────────────────────────────────────────────────────
  { email: 'superadmin@endowglobal.com', name: 'Super Admin', role: 'SUPER_ADMIN', password: 'SuperAdmin@123' },
  { email: 'sa@endowglobal.com', name: 'SA Ops', role: 'SUPER_ADMIN', password: 'SuperAdmin@123' },
  { email: 'admin@endowglobal.com', name: 'Platform Admin', role: 'ADMIN', password: 'Admin@12345', permissions: ['dashboard:view','dashboard:manage','students:view','students:manage','counselors:view','counselors:manage','applications:view','applications:manage','documents:view','documents:manage','deadlines:view','deadlines:manage','universities:view','universities:manage','courses:view','courses:manage','scholarships:view','scholarships:manage','countries:view','countries:manage','messages:view','messages:manage','resources:view','resources:manage','testimonials:view','testimonials:manage','notifications:view','notifications:manage','newsletters:view','newsletters:manage','settings:view','settings:manage','analytics:view','activity:view','revenue:view'] },

  // ─── Counselors ─────────────────────────────────────────────────
  {
    email: 'counselor@endowglobal.com', name: 'Sarah Thompson', role: 'COUNSELOR', password: 'Counselor@123',
    counselorProfile: { bio: 'Senior counselor — UK/Australia specialist', expertiseCountries: ['United Kingdom','Australia','Canada'], expertiseSubjects: ['Computer Science','Business','Engineering'], languages: ['English','Bengali'] }
  },
  {
    email: 'counselor2@endowglobal.com', name: 'James Carter', role: 'COUNSELOR', password: 'Counselor@123',
    counselorProfile: { bio: 'Canada & USA admissions expert', expertiseCountries: ['Canada','United States'], expertiseSubjects: ['Medicine','Engineering'], languages: ['English'] }
  },
  {
    email: 'counselor.au@endowglobal.com', name: 'Emily Nguyen', role: 'COUNSELOR', password: 'Counselor@123',
    counselorProfile: { bio: 'Australia & New Zealand specialist', expertiseCountries: ['Australia','New Zealand'], expertiseSubjects: ['Business','Hospitality'], languages: ['English','Vietnamese'] }
  },

  // ─── Students ───────────────────────────────────────────────────
  { email: 'student1@endowglobal.com', name: 'Aisha Rahman', role: 'STUDENT', password: 'Student@123', studentProfile: { nationality: 'Bangladesh', targetCountries: ['United Kingdom','Australia'] } },
  { email: 'student2@endowglobal.com', name: 'Karim Hossain', role: 'STUDENT', password: 'Student@123', studentProfile: { nationality: 'Bangladesh', targetCountries: ['Canada'] } },
  { email: 'student3@endowglobal.com', name: 'Nusrat Jahan', role: 'STUDENT', password: 'Student@123', studentProfile: { nationality: 'Bangladesh', targetCountries: ['South Korea'] } },

  // ─── RBAC Staff — module specific (all ADMIN) ───────────────────
  { email: 'staff.resources@endowglobal.com', name: 'Resources Staff', role: 'ADMIN', password: 'Staff@123', permissions: ['dashboard:view','resources:view','resources:manage'] },
  { email: 'staff.students@endowglobal.com', name: 'Students Staff', role: 'ADMIN', password: 'Staff@123', permissions: ['dashboard:view','students:view','students:manage','applications:view','documents:view'] },
  { email: 'staff.catalog@endowglobal.com', name: 'Catalog Staff', role: 'ADMIN', password: 'Staff@123', permissions: ['dashboard:view','universities:view','universities:manage','courses:view','courses:manage','countries:view','countries:manage','scholarships:view','scholarships:manage'] },
  { email: 'staff.applications@endowglobal.com', name: 'Applications Staff', role: 'ADMIN', password: 'Staff@123', permissions: ['dashboard:view','applications:view','applications:manage','documents:view','documents:manage','deadlines:view','deadlines:manage'] },
  { email: 'staff.support@endowglobal.com', name: 'Support Staff', role: 'ADMIN', password: 'Staff@123', permissions: ['dashboard:view','messages:view','messages:manage','notifications:view','notifications:manage','newsletters:view','newsletters:manage'] },
  { email: 'staff.counselors@endowglobal.com', name: 'Counselors Staff', role: 'ADMIN', password: 'Staff@123', permissions: ['dashboard:view','counselors:view','counselors:manage','students:view'] },
  { email: 'staff.analytics@endowglobal.com', name: 'Analytics Staff', role: 'ADMIN', password: 'Staff@123', permissions: ['dashboard:view','analytics:view','revenue:view','activity:view'] },
  { email: 'staff.content@endowglobal.com', name: 'Content Staff', role: 'ADMIN', password: 'Staff@123', permissions: ['dashboard:view','resources:view','resources:manage','testimonials:view','testimonials:manage','newsletters:view','scholarships:view'] },
  { email: 'staff.branches@endowglobal.com', name: 'Branches Staff', role: 'ADMIN', password: 'Staff@123', permissions: ['dashboard:view','branches:view','branches:manage','settings:view'] },
]

async function ensureUser(u: SeedUser) {
  const existing = await db.query.users.findFirst({ where: (us, { eq }) => eq(us.email, u.email) })
  let userId: string
  if (!existing) {
    userId = globalThis.crypto.randomUUID()
    await db.insert(schema.users).values({
      id: userId,
      email: u.email,
      name: u.name,
      role: u.role,
      emailVerified: true as any,
      permissions: JSON.stringify(u.permissions ?? []) as any,
    } as any)
    console.log(`✅ Created ${u.role} ${u.email}`)
  } else {
    userId = existing.id
    const updates: any = {}
    if (existing.role !== u.role) updates.role = u.role
    if (u.name && existing.name !== u.name) updates.name = u.name
    // Always sync permissions if provided (force update to ensure known state)
    if (u.permissions) {
      updates.permissions = JSON.stringify(u.permissions)
    }
    if (Object.keys(updates).length) {
      await db.update(schema.users).set(updates).where(eq(schema.users.id, userId))
      console.log(`🔄 Updated ${u.email} ${JSON.stringify(updates)}`)
    } else {
      console.log(`ℹ️  Exists ${u.role} ${u.email}`)
    }
  }

  // Ensure credential account
  const account = await db.query.accounts.findFirst({ where: (a, { and, eq }) => and(eq(a.userId, userId), eq(a.providerId, 'credential')) })
  if (!account) {
    const hashed = await hash(u.password, 12)
    await db.insert(schema.accounts).values({
      id: globalThis.crypto.randomUUID(),
      userId,
      providerId: 'credential',
      accountId: u.email,
      password: hashed,
    } as any)
    console.log(`   🔑 Password set for ${u.email}`)
  } else {
    // Optionally reset password to ensure known value (uncomment to force)
    const hashed = await hash(u.password, 12)
    await db.update(schema.accounts).set({ password: hashed }).where(eq(schema.accounts.id, account.id))
    console.log(`   🔑 Password reset for ${u.email}`)
  }

  // Counselor profile
  if (u.role === 'COUNSELOR' && u.counselorProfile) {
    const cp = await db.query.counselorProfiles.findFirst({ where: (c: any, { eq }) => eq(c.userId, userId) })
    if (!cp) {
      await db.insert(schema.counselorProfiles).values({
        userId,
        bio: u.counselorProfile.bio ?? 'Counselor',
        expertiseCountries: JSON.stringify(u.counselorProfile.expertiseCountries ?? ['United Kingdom']),
        expertiseSubjects: JSON.stringify(u.counselorProfile.expertiseSubjects ?? ['Computer Science']),
        languages: JSON.stringify(u.counselorProfile.languages ?? ['English']),
        isAvailable: true,
      } as any)
      console.log(`   👤 Counselor profile for ${u.email}`)
    }
  }

  // Student profile
  if (u.role === 'STUDENT') {
    const sp = await db.query.studentProfiles.findFirst({ where: (s: any, { eq }) => eq(s.userId, userId) })
    if (!sp) {
      // auto-assign counselor: pick counselor with fewest assigned students
      let assigned: string | null = null
      try {
        const counselors = await db.select({ id: schema.counselorProfiles.id }).from(schema.counselorProfiles).where(eq(schema.counselorProfiles.isAvailable, true as any))
        if (counselors.length) {
          const ids = counselors.map((c: any) => c.id)
          // count load
          const counts: any = {}
          for (const cid of ids) {
            const [row]: any = await db.select({ n: schema.studentProfiles.assignedCounselorId }).from(schema.studentProfiles).where(eq(schema.studentProfiles.assignedCounselorId, cid as any)).then((r: any) => [{ n: r.length }])
            counts[cid] = Number(row?.n ?? 0)
          }
          // Alternative simpler: just pick first
          let best = counselors[0].id
          let bestLoad = counts[best] ?? 0
          for (const c of counselors.slice(1)) {
            const cur = counts[c.id] ?? 0
            if (cur < bestLoad) { best = c.id; bestLoad = cur }
          }
          assigned = best
        }
      } catch {}
      await db.insert(schema.studentProfiles).values({
        userId,
        nationality: u.studentProfile?.nationality ?? 'Bangladesh',
        targetCountries: JSON.stringify(u.studentProfile?.targetCountries ?? ['United Kingdom']),
        assignedCounselorId: assigned ?? null,
      } as any)
      console.log(`   🎓 Student profile for ${u.email} assigned to ${assigned ?? 'none'}`)
    }
  }

  return userId
}

async function main(){
  console.log('🌱 Seeding all user types...\n')
  for(const u of USERS){
    await ensureUser(u)
  }
  console.log('\n🎉 All users seeded!\n')
  console.log('═'.repeat(70))
  console.log('CREDENTIALS (use at /login, /login/admin, /login/counselor, /login/sa)')
  console.log('═'.repeat(70))
  for(const u of USERS){
    const perms = u.permissions?.length ? ` [${u.permissions.join(', ')}]` : ''
    console.log(`${u.role.padEnd(13)} ${u.email.padEnd(35)} ${u.password}${perms}`)
  }
  console.log('═'.repeat(70))
  console.log('\nLogin URLs:')
  console.log('  Student:    /login')
  console.log('  Counselor:  /login  or /login/counselor')
  console.log('  Staff/Admin:/login/admin')
  console.log('  Super Admin:/login/sa  or /login/admin')
}

main().catch(e=>{ console.error(e); process.exit(1) })
