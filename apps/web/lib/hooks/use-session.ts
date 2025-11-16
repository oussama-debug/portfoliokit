"use client";

import { type Session } from "next-auth";
import { useSession as useNextAuthSession } from "next-auth/react";

export function useSession() {
  const { data, status } = useNextAuthSession();
  const session = data as Session | null;

  return {
    session,
    user: session?.user,
    accessToken: session?.access_token,
    refreshToken: session?.refresh_token,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
