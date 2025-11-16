"use client";

import { createAuthClient } from "better-auth/react";
import { env } from "@repo/environment";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_AUTH_URL || process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
  plugins: [],
});

export const { signIn, signUp, signOut, useSession } = authClient;
