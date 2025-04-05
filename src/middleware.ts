// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Define routes protected by role
  const touristProtectedRoutes = [
    "/booking-test",
    "/tourist-dashboard",
    "/my-trips",
  ]
  const guideProtectedRoutes = ["/guide"]

  // General authentication check routes (any authenticated user can access)
  const generalProtectedRoutes = ["/profile", "/messages"]

  const pathname = request.nextUrl.pathname

  // Check if the current route is protected for tourists only
  const isTouristRoute = touristProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if the current route is protected for guides only
  const isGuideRoute = guideProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if the current route is protected for any authenticated user
  const isGeneralProtectedRoute = generalProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Redirect to login if not authenticated
  // if ((isTouristRoute || isGeneralProtectedRoute) && !token) {
  //   const loginUrl = new URL("/login", request.url)
  //   return NextResponse.redirect(loginUrl)
  // }
  //login redirect to guide
  if (isGuideRoute && !token) {
    const loginUrl = new URL("/login/guide", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  if (token) {
    const userRole = token.role as string

    // Redirect guides trying to access tourist-only routes
    if (isTouristRoute && userRole !== "user") {
      const unauthorizedUrl = new URL("/unauthorized", request.url)
      return NextResponse.redirect(unauthorizedUrl)
    }

    // Redirect tourists trying to access guide-only routes
    if (isGuideRoute && userRole !== "guide") {
      const unauthorizedUrl = new URL("/unauthorized", request.url)
      return NextResponse.redirect(unauthorizedUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Add all protected routes to the matcher
    "/booking/:path*",
    "/tourist-dashboard/:path*",
    "/my-trips/:path*",
    "/guide-dashboard/:path*",
    "/manage-tours/:path*",
    "/earnings/:path*",
    "/profile/:path*",
    "/messages/:path*",
    //for guide routes
    "/guide/:path*",
  ],
}
