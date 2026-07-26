import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { DEMO_COOKIE, isDemoModeFromEnv } from "@/services/demoMode";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/chat",
  "/memory",
  "/collection",
  "/dna",
  "/legacy",
  "/market",
  "/settings",
];

// Recovery/reset links establish a real session on load — these must NOT
// be treated like /login or /signup, or a signed-in user clicking a reset
// link gets bounced to /dashboard before they can set a new password.
const AUTH_PREFIXES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Judge Demo Mode: ?demo=true persists as a cookie so it survives
  // subsequent navigations without the query param on every link.
  const requestedDemo = request.nextUrl.searchParams.get("demo") === "true";
  const isDemo =
    requestedDemo || isDemoModeFromEnv() || request.cookies.get(DEMO_COOKIE)?.value === "true";

  if (requestedDemo) {
    response.cookies.set(DEMO_COOKIE, "true", { path: "/", maxAge: 60 * 60 * 24 });
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  const isAuthPage = AUTH_PREFIXES.some((p) => path.startsWith(p));

  // Demo Mode lets judges explore protected routes with no account at all —
  // that's the entire point of the feature.
  if (isProtected && !user && !isDemo) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectedFrom", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
