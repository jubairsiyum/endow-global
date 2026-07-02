import { FileText, CheckCircle } from 'lucide-react'

export const articles = [
  {
    id: 1,
    title: 'Complete Guide to Studying in South Korea',
    description:
      'Comprehensive guide covering everything from visa requirements to finding housing and adjusting to student life.',
    image: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=600&h=400&fit=crop',
    category: 'Study Abroad',
    author: 'Endow Team',
    date: '2024-06-01',
    readTime: '8 min',
    featured: true,
  },
  {
    id: 2,
    title: 'GKS Scholarship Application Tips',
    description:
      'Insider tips and strategies to maximize your chances of getting accepted to the Global Korea Scholarship.',
    image: 'https://images.unsplash.com/photo-1523050854058-f47bcaf00980?w=600&h=400&fit=crop',
    category: 'Scholarships',
    author: 'Scholarship Expert',
    date: '2024-05-28',
    readTime: '5 min',
    featured: true,
  },
  {
    id: 3,
    title: 'Korean D-10 Visa Guide for Students',
    description:
      'Everything you need to know about the student residence visa, including requirements and the application process.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
    category: 'Visa Guide',
    author: 'Immigration Expert',
    date: '2024-05-25',
    readTime: '6 min',
    featured: true,
  },
  {
    id: 4,
    title: 'Student Life at Hanseo University',
    description:
      'Discover campus facilities, student culture, and what makes Hanseo University a great place to study.',
    image: 'https://images.unsplash.com/photo-1523318323282-e5b51eea6a79?w=600&h=400&fit=crop',
    category: 'University News',
    author: 'Campus Reporter',
    date: '2024-05-22',
    readTime: '7 min',
  },
  {
    id: 5,
    title: 'Cost of Living in Seoul vs Busan',
    description:
      "Detailed breakdown of monthly expenses for students living in Korea's major cities.",
    image: 'https://images.unsplash.com/photo-1461749280684-ddefd3083d60?w=600&h=400&fit=crop',
    category: 'Study Abroad',
    author: 'Budget Advisor',
    date: '2024-05-20',
    readTime: '4 min',
  },
  {
    id: 6,
    title: 'Success Story: From Bangladesh to Seoul',
    description:
      'Meet Raiyan, who secured a full scholarship and is now pursuing his MBA at a top Korean university.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    category: 'Success Stories',
    author: 'Endow Stories',
    date: '2024-05-18',
    readTime: '3 min',
  },
  {
    id: 7,
    title: 'Korean Restaurants for International Students',
    description: 'Budget-friendly Korean dining spots loved by students. Learn local food culture.',
    image: 'https://images.unsplash.com/photo-1504674900152-b8b613e4f92b?w=600&h=400&fit=crop',
    category: 'Student Life',
    author: 'Lifestyle Writer',
    date: '2024-05-15',
    readTime: '5 min',
  },
  {
    id: 8,
    title: 'Career Opportunities After Graduation',
    description:
      'Explore job markets, visa sponsorship, and career pathways for international graduates.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    category: 'Career',
    author: 'Career Coach',
    date: '2024-05-12',
    readTime: '9 min',
  },
  {
    id: 9,
    title: 'Statement of Purpose Template & Guide',
    description:
      'Download and use our proven SOP template to write a compelling statement for your applications.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    category: 'Resources',
    author: 'Academic Advisor',
    date: '2024-05-10',
    readTime: '6 min',
  },
]

export type Article = (typeof articles)[number]
export type ArticleCategory = Article['category']

export const categoryColors: Record<ArticleCategory, string> = {
  Scholarships: 'bg-[var(--brand-light)] text-[var(--brand)]',
  'Visa Guide': 'bg-[var(--bg-light)] text-[var(--text-primary)]',
  'Study Abroad': 'bg-[var(--brand-light)] text-[var(--brand)]',
  'University News': 'bg-[var(--bg-light)] text-[var(--text-primary)]',
  'Student Life': 'bg-[var(--brand-light)] text-[var(--brand)]',
  'Success Stories': 'bg-[var(--bg-light)] text-[var(--text-primary)]',
  Career: 'bg-[var(--brand-light)] text-[var(--brand)]',
  Resources: 'bg-[var(--brand-light)] text-[var(--brand)]',
  'Company Updates': 'bg-[var(--bg-light)] text-[var(--text-primary)]',
}
