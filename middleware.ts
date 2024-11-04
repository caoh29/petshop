// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};