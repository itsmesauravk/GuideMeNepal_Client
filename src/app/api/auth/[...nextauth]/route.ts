// import NextAuth, { User } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import GoogleProvider from "next-auth/providers/google"
// import FacebookProvider from "next-auth/providers/facebook"
// import axios from "axios"
// import { JWT } from "next-auth/jwt"
// import { Provider } from "@/providers/Providers"

// interface AuthResponse {
//   data: {
//     jwt: string
//     user: {
//       id: string
//       email: string
//       name: string
//       role: string
//       image: string
//       authMethod: string
//       firstTimeLogin?: boolean
//     }
//   }
// }

// const handler = NextAuth({
//   providers: [
//     //for user
//     CredentialsProvider({
//       id: "user-credentials",
//       name: "User Login",
//       credentials: {
//         identifier: {},
//         password: {},
//       },

//       authorize: async (credentials) => {
//         if (!credentials) return null

//         try {
//           const res = await axios.post<AuthResponse>(
//             `${process.env.NEXT_PUBLIC_API_URL}/client/login`,
//             {
//               email: credentials.identifier,
//               password: credentials.password,
//             }
//           )

//           const { jwt, user } = res.data.data

//           if (user) {
//             return {
//               jwt,
//               id: user.id,
//               email: user.email,
//               name: user.name,
//               role: user.role, // Will be "user"
//               image: user.image,
//             }
//           }
//           return null
//         } catch (error: any) {
//           if (error.response?.data?.error) {
//             throw new Error(error.response.data.error.message)
//           }
//           throw new Error("Tourist authentication failed")
//         }
//       },
//     }),
//     //for guide
//     CredentialsProvider({
//       id: "guide-credentials",
//       name: "Guide Login",
//       credentials: {
//         identifier: {},
//         password: {},
//       },
//       authorize: async (credentials) => {
//         if (!credentials) return null

//         try {
//           const res = await axios.post<AuthResponse>(
//             `${process.env.NEXT_PUBLIC_API_URL}/guide/login`,
//             {
//               email: credentials.identifier,
//               password: credentials.password,
//             }
//           )

//           const { jwt, user } = res.data.data

//           if (user) {
//             return {
//               jwt,
//               id: user.id,
//               email: user.email,
//               name: user.name,
//               role: user.role, // Will be "guide"
//               image: user.image,
//               firstTimeLogin: user.firstTimeLogin,
//             }
//           }
//           return null
//         } catch (error: any) {
//           if (error.response?.data?.error) {
//             throw new Error(error.response.data.error.message)
//           }
//           throw new Error("Guide authentication failed")
//         }
//       },
//     }),
//     //for oauth -google

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID!,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     //credentials
//     jwt: async ({ token, user }: { token: JWT; user?: User }) => {
//       if (user) {
//         token.id = user.id
//         token.email = user.email
//         token.name = user.name
//         token.role = (user as any).role
//         token.image = user.image
//         token.jwt = (user as any).jwt
//         token.firstTimeLogin = (user as any).firstTimeLogin
//       }
//       return token
//     },
//     session: async ({ session, token }: { session: any; token: JWT }) => {
//       session.user = {
//         id: token.id,
//         email: token.email,
//         name: token.name,
//         role: token.role,
//         image: token.image,
//         firstTimeLogin: token.firstTimeLogin,
//       }
//       session.jwt = token.jwt
//       return session
//     },
//   },
//   pages: {
//     signIn: "/login",
//     signOut: "/",
//   },
//   debug: true,
// })

// export { handler as GET, handler as POST }

//updated
import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import axios from "axios"
import { JWT } from "next-auth/jwt"

// Extend the User type to include custom properties
declare module "next-auth" {
  interface User {
    id: string
    jwt?: string
    role?: string
    firstTimeLogin?: boolean
  }

  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      role?: string
      image?: string | null
      firstTimeLogin?: boolean
      provider?: string
    }
    jwt?: string
  }
}

// Extend JWT type to include custom properties
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
    jwt?: string
    provider?: string
    firstTimeLogin?: boolean
  }
}

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
    // Existing credential providers
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
              role: user.role,
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
          console.log("error", error)
          if (error.response?.data?.error) {
            throw new Error(error.response.data.error.message)
          }
          throw new Error("Guide authentication failed")
        }
      },
    }),

    // Modified OAuth providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // Add a flag to identify this is from Google OAuth
          authMethod: "google",
        }
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
          // Add a flag to identify this is from Facebook OAuth
          authMethod: "facebook",
        }
      },
    }),
  ],
  callbacks: {
    // Handle OAuth sign-in
    async signIn({ user, account, profile }) {
      // Only process OAuth accounts (Google, Facebook)
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          // Send OAuth user data to your backend to create/update user
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL_MAIN}/auth/${account.provider}/register`,
            {
              providerId: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
            }
          )
          console.log("Response from backend:", response.data)

          // If successful, allow sign in
          if (response.data.success) {
            // You can store backend response data here if needed
            user.jwt = response.data.data.jwt
            user.role = response.data.data.user.role
            user.id = response.data.data.user.id
            return true
          }
          return false
        } catch (error) {
          console.error("Error registering OAuth user:", error)
          return false
        }
      }

      return true // Allow other sign-in methods to proceed normally
    },

    jwt: async ({
      token,
      user,
      account,
    }: {
      token: JWT
      user?: User
      account?: any
    }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as any).role || "user" // Default to user role
        token.image = user.image

        // If this is from our credentials provider, use the JWT from there
        if ((user as any).jwt) {
          token.jwt = (user as any).jwt
        }

        // Store OAuth provider if relevant
        if (account?.provider) {
          token.provider = account.provider
        }

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
        provider: token.provider, // Add provider info to session if available
      }
      session.jwt = token.jwt
      return session
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error", // Error page for authentication issues
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
