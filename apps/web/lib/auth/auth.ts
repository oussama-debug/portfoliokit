import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { env } from "@repo/environment";
import { zenlanes } from "./plugin";

const GATEWAY_URL =
  env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

const authConfig = {
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
  secret: env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET || "secret",

  session: {
    expiresIn: 60 * 60,
    updateAge: 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://portfoliokit-six.vercel.app",
    "https://zenlanes.com",
  ],

  plugins: [zenlanes()],
} satisfies Partial<BetterAuthOptions>;

export const auth = betterAuth(authConfig);

export type Session = typeof auth.$Infer.Session;
