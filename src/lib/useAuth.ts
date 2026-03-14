// src/lib/useAuth.ts
// ============================================================
// React hook for accessing the current user session.
// Use this in any 'use client' component that needs to know
// who is logged in.
//
// Think of it like an @AuthenticationPrincipal in Spring Boot,
// but as a React hook you call inside a component.
//
// Usage:
//   const { user, isAdmin, loading } = useAuth()
//   const { user, isAdmin, loading } = useAuth({ require: true })      // redirects to /login if not logged in
//   const { user, isAdmin, loading } = useAuth({ require: 'admin' })   // redirects if not admin
// ============================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "./auth";
import type { CrishetteUser } from "./types";

interface UseAuthOptions {
  /** Set to true to redirect to /login if not logged in.
   *  Set to 'admin' to also redirect non-admins to /. */
  require?: boolean | "admin";
}

interface UseAuthResult {
  user: CrishetteUser | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useAuth(options: UseAuthOptions = {}): UseAuthResult {
  const [user, setUser] = useState<CrishetteUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    setUser(session);
    setLoading(false);

    if (options.require) {
      if (!session) {
        router.push("/login");
        return;
      }
      if (options.require === "admin" && session.role !== "admin") {
        router.push("/");
        return;
      }
    }
  }, []);

  return {
    user,
    isAdmin: user?.role === "admin",
    loading,
  };
}
