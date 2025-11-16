"use client";

import { useSession as useBetterSession } from "@/lib/auth/auth-client";

export function useSession() {
  const { data: session, isPending, error } = useBetterSession();

  return {
    session: session || null,
    user: session?.user,
    accessToken: session?.session.token,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    error,
  };
}
