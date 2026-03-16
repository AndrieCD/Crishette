// src/lib/useAuth.ts


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "./auth";
import type { CrishetteUser } from "./types";

interface UseAuthOptions {
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
