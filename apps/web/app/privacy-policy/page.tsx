import type { Metadata } from 'next'

import {
  contactDetails,
  MarketingPageShell,
  PageHero,
} from '@/components/marketing/marketing-content'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Endow Global Education, including how information is collected, used, retained, and protected.',
}

const policySections = [
  {
    title: 'Who we are',
    body: ['Our website address is: http://endowglobaledu.com.'],
  },
  {
    title: 'Information we collect',
    body: [
      'We may collect information you submit through forms, inquiries, comments, registration flows, or direct communication. This may include your name, email address, phone number, academic background, inquiry details, IP address, browser information, and related technical data.',
    ],
  },
  {
    title: 'How we use your information',
    bullets: [
      'Respond to inquiries and consultation requests.',
      'Provide education consultancy guidance and student support.',
      'Share admission, scholarship, visa, or service-related updates.',
      'Improve website performance, security, and user experience.',
      'Detect spam, fraud, abuse, or technical issues.',
    ],
  },
  {
    title: 'Comments',
    body: [
      'When visitors leave comments on the site, we collect the data shown in the comments form, along with the visitor IP address and browser user agent string to help spam detection.',
      'An anonymized string created from your email address may be provided to the Gravatar service to check whether you are using it. After approval of your comment, your profile picture may be visible publicly in the context of your comment.',
    ],
  },
  {
    title: 'Media',
    body: [
      'If you upload images to the website, avoid uploading images with embedded location data included. Visitors may be able to download and extract location data from images on the website.',
    ],
  },
  {
    title: 'Cookies',
    body: [
      'Our website may use cookies to improve browsing experience, remember preferences, support login features, and manage comment-related information. If you leave a comment, you may opt in to saving your name, email address, and website in cookies for convenience.',
      'Login, preference, and editor cookies may be used where account or website management features are available. You can control or disable cookies through your browser settings.',
    ],
  },
  {
    title: 'Embedded content from other websites',
    body: [
      'Pages on this website may include embedded content such as videos, images, or articles. Embedded content from other websites behaves as if you visited those websites directly. These websites may collect data, use cookies, embed third-party tracking, and monitor your interaction with that content according to their own policies.',
    ],
  },
  {
    title: 'Who we share your data with',
    body: [
      'We do not sell personal information. We may share information only where needed for website operation, spam detection, security, service delivery, legal compliance, or administrative purposes.',
    ],
  },
  {
    title: 'How long we retain your data',
    body: [
      'If you leave a comment, the comment and its metadata may be retained so we can recognize and approve follow-up comments. For users who register on our website, we store the personal information provided in their user profile, where applicable.',
      'We retain submitted information only as long as necessary for administrative, legal, security, or service-related purposes.',
    ],
  },
  {
    title: 'What rights you have over your data',
    body: [
      'If you have an account on this site or have left comments, you may request an exported file of the personal data we hold about you. You may also request deletion of personal data, except for information we are required to keep for administrative, legal, or security purposes.',
    ],
  },
  {
    title: 'Where your data is sent',
    body: [
      'Visitor comments may be checked through an automated spam detection service.',
    ],
  },
] as const

export default function PrivacyPolicyPage() {
  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="Privacy policy"
        title="How we protect and handle your information"
        description="Endow Global Education respects your privacy and is committed to handling personal information with care, transparency, and appropriate security."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <aside className="rounded-lg border border-gray-100 bg-[#f7f8fb] p-5 lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-lg font-bold text-gray-950">Contact</h2>
            <dl className="mt-4 space-y-4 text-sm leading-6 text-gray-600">
              <div>
                <dt className="font-semibold text-gray-950">Address</dt>
                <dd>{contactDetails.address}</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-950">Email</dt>
                <dd>{contactDetails.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-950">Phone</dt>
                <dd>{contactDetails.phoneBangladesh}</dd>
                <dd>{contactDetails.phoneKorea}</dd>
              </div>
            </dl>
          </aside>

          <div className="space-y-8">
            {policySections.map((section) => (
              <article key={section.title} className="border-b border-gray-100 pb-8 last:border-b-0">
                <h2 className="text-2xl font-bold text-gray-950">{section.title}</h2>
                {'body' in section
                  ? section.body.map((paragraph) => (
                      <p key={paragraph} className="mt-4 text-base leading-7 text-gray-600">
                        {paragraph}
                      </p>
                    ))
                  : null}
                {'bullets' in section ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-gray-600">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </MarketingPageShell>
  )
}
