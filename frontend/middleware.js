import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes (no auth required)
const isPublicRoute = createRouteMatcher([])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Apply to all non-static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always include API routes
    '/(api|trpc)(.*)',
  ],
}
