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
    async signIn({ user, account }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl) {
        return `${baseUrl}/auth/signin?googleSignIn=true`;
      }
      return url;
    },
    async session({ session, user, token }) {
      // console.log('session', session, user, token)
      session.id_token = token.id_token as string;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log('jwt', token, user, account, profile, isNewUser)
      if (account?.id_token) {
        token.id_token = account.id_token;
      }
      return token;
    }
  },
  debug: false,
  pages: {
    signIn: '/auth/signin',
  }
})

export { handler as GET, handler as POST }