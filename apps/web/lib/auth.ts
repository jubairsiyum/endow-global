import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Resend from 'next-auth/providers/resend'
import { prisma } from './db'
import { UserRole } from '@endow/types'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role as UserRole
        token.id = user.id
      }
      if (trigger === 'update' && session) {
        token.role = session.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
    async signIn({ user, account }) {
      if (user.id && account?.provider) {
        const existing = await prisma.studentProfile.findUnique({
          where: { userId: user.id },
        })
        if (!existing) {
          await prisma.studentProfile.create({
            data: { userId: user.id },
          })
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/verify',
  },
})

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface User {
    role?: UserRole
  }
}
