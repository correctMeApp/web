// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('signIn', user, account, profile, email, credentials)
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      console.log('session', session, user, token)
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('jwt', token, user, account, profile, isNewUser)
      return token
    }
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.log(code, metadata)
    },
    warn(code) {
        console.log(code)
    },
    debug(code, metadata) {
        console.log(code, metadata)
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
})

export { handler as GET, handler as POST }