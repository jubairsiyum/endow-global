import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { countries, universities, scholarships, studentStories } from '@/lib/universities/data'
import CountryDetailContent from './CountryDetailContent'

type PageProps = {
  params: Promise<{ slug: string }>
}

function getCountryBySlug(slug: string) {
  const country = countries.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, '-') === slug
  )
  return country || null
}

function getUniversitiesForCountry(countryName: string) {
  return universities.filter((u) => u.country === countryName)
}

function getScholarshipsForCountry(countryName: string) {
  const countryUniNames = universities
    .filter((u) => u.country === countryName)
    .map((u) => u.name)
  return scholarships.filter((s) => countryUniNames.includes(s.universityName))
}

function getStudentStoriesForCountry(countryName: string) {
  return studentStories.filter((s) => s.country === countryName)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const country = getCountryBySlug(slug)
  if (!country) return { title: 'Country Not Found' }

  return {
    title: `Study in ${country.name} | Endow Global Education`,
    description: country.description,
    openGraph: {
      title: `Study in ${country.name}`,
      description: country.description,
    },
  }
}

export default async function CountryPage({ params }: PageProps) {
  const { slug } = await params
  const country = getCountryBySlug(slug)
  if (!country) notFound()

  const countryUniversities = getUniversitiesForCountry(country.name)
  const countryScholarships = getScholarshipsForCountry(country.name)
  const countryStories = getStudentStoriesForCountry(country.name)

  return (
    <CountryDetailContent
      country={country}
      universities={countryUniversities}
      scholarships={countryScholarships}
      studentStories={countryStories}
    />
  )
}
