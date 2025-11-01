"use client";

import { useSession as useNextAuthSession } from "next-auth/react";

export function useSession() {
  const { data: session, status } = useNextAuthSession();

  return {
    session,
    user: session?.user,
    accessToken: session?.access_token,
    refreshToken: session?.refresh_token,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
