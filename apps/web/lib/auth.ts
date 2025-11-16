import { env } from "@repo/environment";
import NextAuth from "next-auth";
import type { NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type GatewayAuthResponse = {
  success: boolean;
  user: {
    id: string;
    username: string;
    createdAt: string;
    email_confirmed: boolean;
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
};

async function loginToGateway(
  username: string,
  password: string
): Promise<GatewayAuthResponse | null> {
  try {
    const apiUrl = env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL not configured");
      return null;
    }

    const response = await fetch(`${apiUrl}/v1/gateway/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

async function refreshGatewayToken(token: string): Promise<GatewayAuthResponse | null> {
  try {
    const apiUrl = env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL not configured");
      return null;
    }

    const response = await fetch(`${apiUrl}/v1/gateway/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

const nextAuth = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const result = await loginToGateway(
          credentials.email as string,
          credentials.password as string
        );

        if (!result || !result.success) {
          throw new Error("Invalid credentials");
        }

        return {
          id: result.user.id,
          username: result.user.username,
          email: result.user.username,
          email_confirmed: result.user.email_confirmed,
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user: User;
      trigger?: "signIn" | "signUp" | "update";
      session?: any;
    }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email_confirmed = user.email_confirmed;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
      }

      if (trigger === "update" && session?.refresh_token) {
        const refreshed = await refreshGatewayToken(session.refresh_token);
        if (refreshed?.success) {
          token.access_token = refreshed.session.access_token;
          token.refresh_token = refreshed.session.refresh_token;
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.email_confirmed = token.email_confirmed;
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;

      return session;
    },
    async authorized({
      auth,
      request: { nextUrl },
    }: {
      auth: Session | null;
      request: { nextUrl: URL };
    }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute =
        nextUrl.pathname.startsWith("/scheduled") || nextUrl.pathname.startsWith("/settings");
      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      if (isOnProtectedRoute && !isLoggedIn) {
        return false;
      }

      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/scheduled", nextUrl));
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
});

export const handlers: NextAuthResult["handlers"] = nextAuth.handlers;
export const auth: NextAuthResult["auth"] = nextAuth.auth;
export const signIn: NextAuthResult["signIn"] = nextAuth.signIn;
export const signOut: NextAuthResult["signOut"] = nextAuth.signOut;
