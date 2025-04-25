import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import axios from "axios"
import { JWT } from "next-auth/jwt"
import { Provider } from "@/providers/Providers"

interface AuthResponse {
  data: {
    jwt: string
    user: {
      id: string
      email: string
      name: string
      role: string
      image: string
      authMethod: string
      firstTimeLogin?: boolean
    }
  }
}

const handler = NextAuth({
  providers: [
    //for user
    CredentialsProvider({
      id: "user-credentials",
      name: "User Login",
      credentials: {
        identifier: {},
        password: {},
      },

      authorize: async (credentials) => {
        if (!credentials) return null

        try {
          const res = await axios.post<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/client/login`,
            {
              email: credentials.identifier,
              password: credentials.password,
            }
          )

          const { jwt, user } = res.data.data

          if (user) {
            return {
              jwt,
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role, // Will be "user"
              image: user.image,
            }
          }
          return null
        } catch (error: any) {
          if (error.response?.data?.error) {
            throw new Error(error.response.data.error.message)
          }
          throw new Error("Tourist authentication failed")
        }
      },
    }),
    //for guide
    CredentialsProvider({
      id: "guide-credentials",
      name: "Guide Login",
      credentials: {
        identifier: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials) return null

        try {
          const res = await axios.post<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/guide/login`,
            {
              email: credentials.identifier,
              password: credentials.password,
            }
          )

          const { jwt, user } = res.data.data

          if (user) {
            return {
              jwt,
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role, // Will be "guide"
              image: user.image,
              firstTimeLogin: user.firstTimeLogin,
            }
          }
          return null
        } catch (error: any) {
          if (error.response?.data?.error) {
            throw new Error(error.response.data.error.message)
          }
          throw new Error("Guide authentication failed")
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as any).role
        token.image = user.image
        token.jwt = (user as any).jwt
        token.firstTimeLogin = (user as any).firstTimeLogin
      }
      return token
    },
    session: async ({ session, token }: { session: any; token: JWT }) => {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        image: token.image,
        firstTimeLogin: token.firstTimeLogin,
      }
      session.jwt = token.jwt
      return session
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  debug: true,
})

export { handler as GET, handler as POST }
