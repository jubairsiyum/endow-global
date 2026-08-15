import { db, schema } from '../..'

// NOTE: `tuition_fee` is `int NOT NULL` in this schema, so the source's NULL
// tuition (unknown/not published) is stored as 0 — the same sentinel the admin
// UI already uses (`parseInt(form.tuitionFee) || 0`). The course detail page
// already hides `$0` via a `> 0` check.

const GENERIC_REQUIREMENTS = [
  'High-school completion or equivalent; applicant generally non-Korean (many universities require both parents to be non-Korean); valid passport; academic transcripts and graduation certificate; financial proof; TOPIK or IELTS/TOEFL depending on track; study plan/personal statement; interview may apply depending on department. (General requirement set from source document; not confirmed per-program.)',
]

const UNIVERSITY_META: Record<string, { campus: string; scholarship: string }> = {
  'yewon-arts-university': {
    campus: 'Yangju / Imsil',
    scholarship: 'International scholarships mentioned as available; exact percentages not published.',
  },
  'chungbuk-national-university': {
    campus: 'Cheongju',
    scholarship:
      '30% tuition reduction scholarship noted for qualifying international undergraduates, plus GKS opportunities.',
  },
  'silla-university': {
    campus: 'Busan',
    scholarship:
      '50-100% first-semester tuition awards for qualifying English-track IELTS/TOEFL scores; up to 70-100% based on TOPIK levels.',
  },
  'sungshin-womens-university': {
    campus: 'Seoul',
    scholarship:
      'Scholarship outlook noted as "University + GKS" in source; no specific percentages published.',
  },
  'hansung-university': {
    campus: 'Seoul',
    scholarship:
      'Tiered TOPIK-based scholarship: 30% at TOPIK 3, 50% at TOPIK 4, 80% at TOPIK 5, 100% at TOPIK 6 (first semester); continuing awards can be GPA-based.',
  },
  'busan-university-of-foreign-studies': {
    campus: 'Busan',
    scholarship:
      'Scholarship outlook noted as "Scholarships + GKS" in source; no specific percentages published.',
  },
  'kyungsung-university': {
    campus: 'Busan',
    scholarship:
      'Scholarships of 30-50% reported for qualifying IELTS/TOEFL scores, with higher awards possible.',
  },
  'chungbuk-health-science-university': {
    campus: 'Cheongju',
    scholarship:
      'Scholarship outlook noted generically as "International scholarships" in source; no specific percentages published.',
  },
  'cheju-halla-university': {
    campus: 'Jeju City',
    scholarship:
      'Scholarship outlook noted generically as "University/international scholarships" in source; no specific percentages published.',
  },
  'konyang-university': {
    campus: 'Nonsan / Daejeon',
    scholarship: 'GPA-based reductions of 40%, 50% and 60% noted, with additional TOPIK-related support.',
  },
}

const APP_FEE: Record<string, number> = {
  'chungbuk-national-university': 72000,
  'silla-university': 50000,
}

interface CourseSeed {
  u: string
  name: string
  slug: string
  subject: string
  language: string
  tuition: number | null
  description: string
}

const courses: CourseSeed[] = [
  // ─── Yewon Arts University ──────────────────────────────
  { u: 'yewon-arts-university', name: 'International Management – Business', slug: 'yewon-arts-university-international-management-business', subject: 'Business', language: 'Korean / English', tuition: null, description: 'International Management – Business at Yewon Arts University (Yangju / Imsil campus). Tuition not published per-major in source data; confirm with university.' },
  { u: 'yewon-arts-university', name: 'International Management – Culture & Arts Contents', slug: 'yewon-arts-university-international-management-culture-and-arts-contents', subject: 'Business & Cultural Industries', language: 'Korean / English', tuition: null, description: 'International Management – Culture & Arts Contents at Yewon Arts University (Yangju / Imsil campus). Tuition not published per-major in source data; confirm with university.' },
  { u: 'yewon-arts-university', name: 'Global Culture & Arts Management', slug: 'yewon-arts-university-global-culture-and-arts-management', subject: 'Arts & Cultural Management', language: 'Korean / English', tuition: null, description: 'Global Culture & Arts Management at Yewon Arts University (Yangju / Imsil campus). Tuition not published per-major in source data; confirm with university.' },
  { u: 'yewon-arts-university', name: 'Korean Culture & Arts', slug: 'yewon-arts-university-korean-culture-and-arts', subject: 'Arts', language: 'Mainly Korean', tuition: null, description: 'Korean Culture & Arts at Yewon Arts University (Yangju / Imsil campus). Tuition not published per-major in source data; confirm with university.' },
  { u: 'yewon-arts-university', name: 'Culture & Arts Tourism', slug: 'yewon-arts-university-culture-and-arts-tourism', subject: 'Tourism & Arts', language: 'Mainly Korean', tuition: null, description: 'Culture & Arts Tourism at Yewon Arts University (Yangju / Imsil campus). Tuition not published per-major in source data; confirm with university.' },
  { u: 'yewon-arts-university', name: 'Animation & Webtoon', slug: 'yewon-arts-university-animation-and-webtoon', subject: 'Animation & Design', language: 'Mainly Korean', tuition: null, description: 'Animation & Webtoon at Yewon Arts University (Yangju / Imsil campus). Tuition not published per-major in source data; confirm with university.' },
  { u: 'yewon-arts-university', name: 'Visual & Video Design', slug: 'yewon-arts-university-visual-and-video-design', subject: 'Design', language: 'Mainly Korean', tuition: null, description: 'Visual & Video Design at Yewon Arts University (Yangju / Imsil campus). Tuition not published per-major in source data; confirm with university.' },
  { u: 'yewon-arts-university', name: 'Game Animation', slug: 'yewon-arts-university-game-animation', subject: 'Animation & Design', language: 'Mainly Korean', tuition: null, description: 'Game Animation at Yewon Arts University (Yangju / Imsil campus). Tuition not published per-major in source data; confirm with university.' },
  { u: 'yewon-arts-university', name: 'Performing Arts / Practical Music', slug: 'yewon-arts-university-performing-arts-practical-music', subject: 'Performing Arts', language: 'Mainly Korean', tuition: null, description: 'Performing Arts / Practical Music at Yewon Arts University (Yangju / Imsil campus). Tuition not published per-major in source data; confirm with university.' },
  { u: 'yewon-arts-university', name: 'Sports Science / Sports Welfare', slug: 'yewon-arts-university-sports-science-sports-welfare', subject: 'Sports Science', language: 'Mainly Korean', tuition: null, description: 'Sports Science / Sports Welfare at Yewon Arts University (Yangju / Imsil campus). Tuition not published per-major in source data; confirm with university.' },

  // ─── Chungbuk National University ───────────────────────
  { u: 'chungbuk-national-university', name: 'Business Administration', slug: 'chungbuk-national-university-business-administration', subject: 'Business', language: 'Mostly Korean', tuition: 1380, description: 'Business Administration at Chungbuk National University (Cheongju campus). Mapped to \'Humanities & Social Sciences\' tuition tier (~US$1,380/semester, ~KRW1.9m).' },
  { u: 'chungbuk-national-university', name: 'International Studies', slug: 'chungbuk-national-university-international-studies', subject: 'International Studies', language: 'International / English-oriented', tuition: 1380, description: 'International Studies at Chungbuk National University (Cheongju campus). Mapped to \'Humanities & Social Sciences\' tuition tier (~US$1,380/semester, ~KRW1.9m).' },
  { u: 'chungbuk-national-university', name: 'Engineering', slug: 'chungbuk-national-university-engineering', subject: 'Engineering', language: 'Mostly Korean; some English', tuition: 1835, description: 'Engineering at Chungbuk National University (Cheongju campus). Mapped to \'Engineering\' tuition tier (~US$1,835/semester, ~KRW2.5m).' },
  { u: 'chungbuk-national-university', name: 'Computer / IT', slug: 'chungbuk-national-university-computer-it', subject: 'Computer Science & IT', language: 'Korean / selected English', tuition: 1835, description: 'Computer / IT at Chungbuk National University (Cheongju campus). Approximated using \'Engineering\' tuition tier (~US$1,835/semester); no distinct IT tier published.' },
  { u: 'chungbuk-national-university', name: 'Natural Sciences', slug: 'chungbuk-national-university-natural-sciences', subject: 'Natural Sciences', language: 'Mostly Korean', tuition: 1700, description: 'Natural Sciences at Chungbuk National University (Cheongju campus). Mapped to \'Natural Sciences\' tuition tier (~US$1,700/semester, ~KRW2.3m).' },
  { u: 'chungbuk-national-university', name: 'Agriculture & Life Sciences', slug: 'chungbuk-national-university-agriculture-and-life-sciences', subject: 'Agriculture & Life Sciences', language: 'Mostly Korean', tuition: 1700, description: 'Agriculture & Life Sciences at Chungbuk National University (Cheongju campus). Approximated using \'Natural Sciences\' tuition tier (~US$1,700/semester); no distinct tier published.' },
  { u: 'chungbuk-national-university', name: 'Humanities & Social Sciences', slug: 'chungbuk-national-university-humanities-and-social-sciences', subject: 'Humanities & Social Sciences', language: 'Mostly Korean', tuition: 1380, description: 'Humanities & Social Sciences at Chungbuk National University (Cheongju campus). Mapped to \'Humanities & Social Sciences\' tuition tier (~US$1,380/semester, ~KRW1.9m).' },

  // ─── Silla University ───────────────────────────────────
  { u: 'silla-university', name: 'Aeronautical Science & Flight Operation', slug: 'silla-university-aeronautical-science-and-flight-operation', subject: 'Aviation', language: 'Korean', tuition: 3155, description: 'Aeronautical Science & Flight Operation at Silla University (Busan campus). Mapped to \'Flight Operation Engineering\' tuition tier (~US$3,134-3,177/semester, ~KRW4.3-4.4m); midpoint used.' },
  { u: 'silla-university', name: 'Aviation Maintenance Engineering', slug: 'silla-university-aviation-maintenance-engineering', subject: 'Aviation Engineering', language: 'Korean', tuition: 2915, description: 'Aviation Maintenance Engineering at Silla University (Busan campus). Mapped to \'Engineering / Arts\' tuition tier (~US$2,915/semester, ~KRW4.0m).' },
  { u: 'silla-university', name: 'Aviation Service Management', slug: 'silla-university-aviation-service-management', subject: 'Aviation & Business', language: 'Korean', tuition: 2304, description: 'Aviation Service Management at Silla University (Busan campus). Mapped to \'Aviation Humanities\' tuition tier (~US$2,304/semester, ~KRW3.1m).' },
  { u: 'silla-university', name: 'Air Traffic & Logistics Management', slug: 'silla-university-air-traffic-and-logistics-management', subject: 'Aviation & Logistics', language: 'Korean', tuition: 2304, description: 'Air Traffic & Logistics Management at Silla University (Busan campus). Mapped to \'Aviation Humanities\' tuition tier (~US$2,304/semester, ~KRW3.1m).' },
  { u: 'silla-university', name: 'Business Administration', slug: 'silla-university-business-administration', subject: 'Business', language: 'Korean', tuition: 2159, description: 'Business Administration at Silla University (Busan campus). Mapped to \'Business / Humanities & Social Sciences\' tuition tier (~US$2,159/semester, ~KRW3.0m).' },
  { u: 'silla-university', name: 'International Relations', slug: 'silla-university-international-relations', subject: 'International Relations', language: 'Korean / international options', tuition: 2159, description: 'International Relations at Silla University (Busan campus). Mapped to \'Business / Humanities & Social Sciences\' tuition tier (~US$2,159/semester, ~KRW3.0m).' },
  { u: 'silla-university', name: 'IT / Engineering', slug: 'silla-university-it-engineering', subject: 'Computer Science & IT', language: 'Korean / English options', tuition: 2915, description: 'IT / Engineering at Silla University (Busan campus). Mapped to \'Engineering / Arts\' tuition tier (~US$2,915/semester, ~KRW4.0m).' },
  { u: 'silla-university', name: 'Languages & Global Studies', slug: 'silla-university-languages-and-global-studies', subject: 'Languages & Global Studies', language: 'Multilingual', tuition: 2159, description: 'Languages & Global Studies at Silla University (Busan campus). Mapped to \'Business / Humanities & Social Sciences\' tuition tier (~US$2,159/semester, ~KRW3.0m).' },

  // ─── Sungshin Women's University ────────────────────────
  { u: 'sungshin-womens-university', name: 'Business Administration', slug: 'sungshin-womens-university-business-administration', subject: 'Business', language: 'Mostly Korean', tuition: null, description: 'Business Administration at Sungshin Women\'s University (Seoul campus). No per-program tuition tier published; source gives only an aggregate planning range of ~KRW5.5m-8m/year.' },
  { u: 'sungshin-womens-university', name: 'Economics / Social Sciences', slug: 'sungshin-womens-university-economics-social-sciences', subject: 'Economics & Social Sciences', language: 'Mostly Korean', tuition: null, description: 'Economics / Social Sciences at Sungshin Women\'s University (Seoul campus). No per-program tuition tier published; source gives only an aggregate planning range of ~KRW5.5m-8m/year.' },
  { u: 'sungshin-womens-university', name: 'Media & Communication', slug: 'sungshin-womens-university-media-and-communication', subject: 'Media & Communication', language: 'Mostly Korean', tuition: null, description: 'Media & Communication at Sungshin Women\'s University (Seoul campus). No per-program tuition tier published; source gives only an aggregate planning range of ~KRW5.5m-8m/year.' },
  { u: 'sungshin-womens-university', name: 'Beauty / Cosmetics', slug: 'sungshin-womens-university-beauty-cosmetics', subject: 'Beauty & Cosmetics', language: 'Mostly Korean', tuition: null, description: 'Beauty / Cosmetics at Sungshin Women\'s University (Seoul campus). No per-program tuition tier published; source gives only an aggregate planning range of ~KRW5.5m-8m/year.' },
  { u: 'sungshin-womens-university', name: 'Fashion', slug: 'sungshin-womens-university-fashion', subject: 'Fashion', language: 'Mostly Korean', tuition: null, description: 'Fashion at Sungshin Women\'s University (Seoul campus). No per-program tuition tier published; source gives only an aggregate planning range of ~KRW5.5m-8m/year.' },
  { u: 'sungshin-womens-university', name: 'Arts & Design', slug: 'sungshin-womens-university-arts-and-design', subject: 'Arts & Design', language: 'Mostly Korean', tuition: null, description: 'Arts & Design at Sungshin Women\'s University (Seoul campus). No per-program tuition tier published; source gives only an aggregate planning range of ~KRW5.5m-8m/year.' },
  { u: 'sungshin-womens-university', name: 'Computer / IT', slug: 'sungshin-womens-university-computer-it', subject: 'Computer Science & IT', language: 'Program dependent', tuition: null, description: 'Computer / IT at Sungshin Women\'s University (Seoul campus). No per-program tuition tier published; source gives only an aggregate planning range of ~KRW5.5m-8m/year.' },

  // ─── Hansung University ─────────────────────────────────
  { u: 'hansung-university', name: 'Business Administration', slug: 'hansung-university-business-administration', subject: 'Business', language: 'Mostly Korean', tuition: 2800, description: 'Business Administration at Hansung University (Seoul campus). Mapped to \'Social Sciences / Humanities / Business\' tuition tier (~US$2,800/semester, ~KRW3.8m).' },
  { u: 'hansung-university', name: 'Global Business / International Studies', slug: 'hansung-university-global-business-international-studies', subject: 'International Business', language: 'Korean / some English', tuition: 2800, description: 'Global Business / International Studies at Hansung University (Seoul campus). Mapped to \'Social Sciences / Humanities / Business\' tuition tier (~US$2,800/semester, ~KRW3.8m).' },
  { u: 'hansung-university', name: 'Design', slug: 'hansung-university-design', subject: 'Design', language: 'Korean', tuition: 3600, description: 'Design at Hansung University (Seoul campus). Mapped to \'Arts\' tuition tier (~US$3,600/semester, ~KRW5.0m) as the closest published category.' },
  { u: 'hansung-university', name: 'IT / Engineering', slug: 'hansung-university-it-engineering', subject: 'Computer Science & IT', language: 'Korean', tuition: 3600, description: 'IT / Engineering at Hansung University (Seoul campus). Mapped to \'Engineering\' tuition tier (~US$3,600/semester, ~KRW5.0m).' },
  { u: 'hansung-university', name: 'Social Sciences & Humanities', slug: 'hansung-university-social-sciences-and-humanities', subject: 'Social Sciences & Humanities', language: 'Korean', tuition: 2800, description: 'Social Sciences & Humanities at Hansung University (Seoul campus). Mapped to \'Social Sciences / Humanities / Business\' tuition tier (~US$2,800/semester, ~KRW3.8m).' },
  { u: 'hansung-university', name: 'Arts', slug: 'hansung-university-arts', subject: 'Arts', language: 'Korean', tuition: 3600, description: 'Arts at Hansung University (Seoul campus). Mapped to \'Arts\' tuition tier (~US$3,600/semester, ~KRW5.0m).' },

  // ─── Busan University of Foreign Studies ────────────────
  { u: 'busan-university-of-foreign-studies', name: 'International Business', slug: 'busan-university-of-foreign-studies-international-business', subject: 'Business', language: 'Korean / program dependent', tuition: 2850, description: 'International Business at Busan University of Foreign Studies (Busan campus). Mapped to the \'Business\' indicative tuition figure (~US$2,850/semester).' },
  { u: 'busan-university-of-foreign-studies', name: 'Global Studies', slug: 'busan-university-of-foreign-studies-global-studies', subject: 'Global Studies', language: 'International', tuition: 2600, description: 'Global Studies at Busan University of Foreign Studies (Busan campus). Mapped to the \'Humanities\' indicative tuition figure (~US$2,600/semester).' },
  { u: 'busan-university-of-foreign-studies', name: 'Foreign Languages', slug: 'busan-university-of-foreign-studies-foreign-languages', subject: 'Languages', language: 'Multilingual', tuition: 2600, description: 'Foreign Languages at Busan University of Foreign Studies (Busan campus). Mapped to the \'Humanities\' indicative tuition figure (~US$2,600/semester).' },
  { u: 'busan-university-of-foreign-studies', name: 'International Tourism', slug: 'busan-university-of-foreign-studies-international-tourism', subject: 'Tourism & Hospitality', language: 'Program dependent', tuition: 2600, description: 'International Tourism at Busan University of Foreign Studies (Busan campus). Approximated using the \'Humanities\' indicative tuition figure (~US$2,600/semester); no distinct tourism tier published.' },
  { u: 'busan-university-of-foreign-studies', name: 'IT / Digital Business', slug: 'busan-university-of-foreign-studies-it-digital-business', subject: 'Computer Science & IT', language: 'Program dependent', tuition: 3530, description: 'IT / Digital Business at Busan University of Foreign Studies (Busan campus). Mapped to the \'IT\' indicative tuition figure (~US$3,530/semester).' },
  { u: 'busan-university-of-foreign-studies', name: 'Korean / Korean Studies', slug: 'busan-university-of-foreign-studies-korean-korean-studies', subject: 'Korean Studies', language: 'Korean', tuition: 2600, description: 'Korean / Korean Studies at Busan University of Foreign Studies (Busan campus). Approximated using the \'Humanities\' indicative tuition figure (~US$2,600/semester).' },

  // ─── Kyungsung University ───────────────────────────────
  { u: 'kyungsung-university', name: 'Global Business Administration', slug: 'kyungsung-university-global-business-administration', subject: 'Business', language: 'English', tuition: null, description: 'Global Business Administration at Kyungsung University (Busan campus). Source lists tuition as \'program-specific fee, confirm current 2026 guide\'; overall annual planning tuition estimated at ~KRW5m-7m.' },
  { u: 'kyungsung-university', name: 'Global Hospitality Management', slug: 'kyungsung-university-global-hospitality-management', subject: 'Hospitality & Tourism', language: 'English', tuition: null, description: 'Global Hospitality Management at Kyungsung University (Busan campus). Source lists tuition as \'program-specific fee, confirm current 2026 guide\'; overall annual planning tuition estimated at ~KRW5m-7m.' },
  { u: 'kyungsung-university', name: 'Global Korean Studies', slug: 'kyungsung-university-global-korean-studies', subject: 'Korean Studies', language: 'English', tuition: null, description: 'Global Korean Studies at Kyungsung University (Busan campus). Source lists tuition as \'program-specific fee, confirm current 2026 guide\'; overall annual planning tuition estimated at ~KRW5m-7m.' },
  { u: 'kyungsung-university', name: 'Global Mechanical Design Engineering', slug: 'kyungsung-university-global-mechanical-design-engineering', subject: 'Engineering', language: 'English', tuition: null, description: 'Global Mechanical Design Engineering at Kyungsung University (Busan campus). Source lists tuition as \'program-specific fee, confirm current 2026 guide\'; overall annual planning tuition estimated at ~KRW5m-7m.' },
  { u: 'kyungsung-university', name: 'Global IT Engineering', slug: 'kyungsung-university-global-it-engineering', subject: 'Computer Science & IT', language: 'English', tuition: null, description: 'Global IT Engineering at Kyungsung University (Busan campus). Source lists tuition as \'program-specific fee, confirm current 2026 guide\'; overall annual planning tuition estimated at ~KRW5m-7m.' },

  // ─── Chungbuk Health & Science University ───────────────
  { u: 'chungbuk-health-science-university', name: 'Nursing', slug: 'chungbuk-health-science-university-nursing', subject: 'Nursing', language: 'Mainly Korean', tuition: null, description: 'Nursing at Chungbuk Health & Science University (Cheongju campus). Source lists tuition as \'confirm by program\'; current public 2026 program-level figure flagged as not sufficiently reliable.' },
  { u: 'chungbuk-health-science-university', name: 'Medical Laboratory Science', slug: 'chungbuk-health-science-university-medical-laboratory-science', subject: 'Health Sciences', language: 'Mainly Korean', tuition: null, description: 'Medical Laboratory Science at Chungbuk Health & Science University (Cheongju campus). Source lists tuition as \'confirm by program\'; current public 2026 program-level figure flagged as not sufficiently reliable.' },
  { u: 'chungbuk-health-science-university', name: 'Dental / Oral Health', slug: 'chungbuk-health-science-university-dental-oral-health', subject: 'Health Sciences', language: 'Mainly Korean', tuition: null, description: 'Dental / Oral Health at Chungbuk Health & Science University (Cheongju campus). Source lists tuition as \'confirm by program\'; current public 2026 program-level figure flagged as not sufficiently reliable.' },
  { u: 'chungbuk-health-science-university', name: 'Radiology / Medical Imaging', slug: 'chungbuk-health-science-university-radiology-medical-imaging', subject: 'Health Sciences', language: 'Mainly Korean', tuition: null, description: 'Radiology / Medical Imaging at Chungbuk Health & Science University (Cheongju campus). Source lists tuition as \'confirm by program\'; current public 2026 program-level figure flagged as not sufficiently reliable.' },
  { u: 'chungbuk-health-science-university', name: 'Health Administration', slug: 'chungbuk-health-science-university-health-administration', subject: 'Health Administration', language: 'Mainly Korean', tuition: null, description: 'Health Administration at Chungbuk Health & Science University (Cheongju campus). Source lists tuition as \'confirm by program\'; current public 2026 program-level figure flagged as not sufficiently reliable.' },

  // ─── Cheju Halla University ─────────────────────────────
  { u: 'cheju-halla-university', name: 'Nursing', slug: 'cheju-halla-university-nursing', subject: 'Nursing', language: 'Mainly Korean', tuition: 2500, description: 'Nursing at Cheju Halla University (Jeju City campus). Mapped to \'Nursing\' tuition tier (~US$2,500/semester, ~KRW3.4m).' },
  { u: 'cheju-halla-university', name: 'Health Sciences', slug: 'cheju-halla-university-health-sciences', subject: 'Health Sciences', language: 'Mainly Korean', tuition: 2500, description: 'Health Sciences at Cheju Halla University (Jeju City campus). Mapped to \'Health Sciences\' tuition tier (~US$2,500/semester, ~KRW3.4m).' },
  { u: 'cheju-halla-university', name: 'Tourism & Hospitality', slug: 'cheju-halla-university-tourism-and-hospitality', subject: 'Tourism & Hospitality', language: 'Program dependent', tuition: null, description: 'Tourism & Hospitality at Cheju Halla University (Jeju City campus). No tuition tier published for this program in the cost-breakdown source; confirm with university.' },

  // ─── Konyang University ─────────────────────────────────
  { u: 'konyang-university', name: 'Business Administration', slug: 'konyang-university-business-administration', subject: 'Business', language: 'Korean / program dependent', tuition: 2050, description: 'Business Administration at Konyang University (Nonsan / Daejeon campus). Mapped to \'Liberal Arts / Social Sciences\' tuition tier (~US$2,050/semester, ~KRW2.8m).' },
  { u: 'konyang-university', name: 'IT / Computer Engineering', slug: 'konyang-university-it-computer-engineering', subject: 'Computer Science & IT', language: 'Korean / selected English', tuition: 2600, description: 'IT / Computer Engineering at Konyang University (Nonsan / Daejeon campus). Mapped to \'Engineering\' tuition tier (~US$2,600/semester, ~KRW3.6m).' },
  { u: 'konyang-university', name: 'Engineering', slug: 'konyang-university-engineering', subject: 'Engineering', language: 'Korean', tuition: 2600, description: 'Engineering at Konyang University (Nonsan / Daejeon campus). Mapped to \'Engineering\' tuition tier (~US$2,600/semester, ~KRW3.6m).' },
  { u: 'konyang-university', name: 'Medical / Health Sciences', slug: 'konyang-university-medical-health-sciences', subject: 'Health Sciences', language: 'Korean', tuition: 2600, description: 'Medical / Health Sciences at Konyang University (Nonsan / Daejeon campus). Approximated using the \'Natural Sciences\' tuition tier (~US$2,600/semester); no distinct medical/health tier published for Konyang.' },
  { u: 'konyang-university', name: 'Tourism / Medical Tourism', slug: 'konyang-university-tourism-medical-tourism', subject: 'Tourism & Hospitality', language: 'Korean / selected English', tuition: 2050, description: 'Tourism / Medical Tourism at Konyang University (Nonsan / Daejeon campus). Approximated using the \'Liberal Arts / Social Sciences\' tuition tier (~US$2,050/semester); no distinct tourism tier published.' },
]

async function main() {
  console.log('🎓 Seeding South Korean bachelor courses...\n')

  const uniIdCache = new Map<string, string>()
  let inserted = 0
  let skipped = 0

  for (const c of courses) {
    let universityId = uniIdCache.get(c.u)
    if (!universityId) {
      const uni = await db.query.universities.findFirst({
        where: (u, { eq }) => eq(u.slug, c.u),
      })
      if (!uni) {
        console.log(`⚠️  University not found, skipping courses: ${c.u}`)
        continue
      }
      universityId = uni.id
      uniIdCache.set(c.u, universityId)
    }

    const existing = await db.query.courses.findFirst({
      where: (x, { eq }) => eq(x.slug, c.slug),
    })
    if (existing) {
      console.log(`⏭️  Skipped (slug exists): ${c.slug}`)
      skipped++
      continue
    }

    const meta = UNIVERSITY_META[c.u]

    await db.insert(schema.courses).values({
      universityId,
      name: c.name,
      slug: c.slug,
      subject: c.subject,
      level: 'UNDERGRADUATE',
      duration: 4,
      durationUnit: 'YEARS',
      tuitionFee: c.tuition ?? 0,
      currency: 'USD',
      language: c.language,
      requirements: GENERIC_REQUIREMENTS,
      hasScholarship: true,
      scholarshipDetails: meta.scholarship,
      description: c.description,
      campus: meta.campus,
      modeOfStudy: 'FULL_TIME',
      highlights: [`Language/track: ${c.language}. Scholarships available (see scholarship_details).`],
      applicationFee: APP_FEE[c.u] ?? null,
      isActive: true,
    })

    console.log(`✅ Inserted: ${c.name} (${c.u})`)
    inserted++
  }

  console.log(`\n🎉 Done. Inserted: ${inserted}, Skipped: ${skipped}`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
