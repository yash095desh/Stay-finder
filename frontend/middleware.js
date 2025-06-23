import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/host-dashboard(.*)",
  "/user(.*)",
  "/listing/create-new",
  "/listing/edit(.*)",
]);

export default clerkMiddleware((auth, req) => {
  try {
    if (isProtectedRoute(req)) {
      const { userId } = auth();
      if (!userId) {
        return Response.redirect(new URL("/sign-in", req.url));
      }
    }
  } catch (err) {
    console.error("🔴 Middleware crashed:", err);
    return new Response("Middleware Error", { status: 500 });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
