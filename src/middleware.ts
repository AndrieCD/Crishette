// src/middleware.ts
// This file runs BEFORE every page loads — like a security guard at the door.
// It checks if the user has an active Supabase session.
// If not logged in → redirect to /login
// If logged in and visiting /login → redirect to / (home)
//
// Think of it like the [Authorize] attribute in C# ASP.NET,
// or an @login_required decorator in Python Django.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // We build a response object that we can attach cookies to.
  // Supabase needs this to read and refresh the session cookie.
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create a Supabase client that works in middleware (server-side)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Check if there is an active session
  // getUser() is safer than getSession() — it verifies the token with Supabase servers
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 🔒 Not logged in + trying to visit a protected page → send to /login
  if (!user && pathname !== "/login" && pathname !== "/") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Already logged in + visiting /login → send to home (no need to see login again)
  if (user && pathname === "/login") {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  // Otherwise, let the request through normally
  return supabaseResponse;
}

// This tells Next.js WHICH routes the middleware should run on.
// We exclude static files, images, and Next.js internals —
// we only want to guard actual pages.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
