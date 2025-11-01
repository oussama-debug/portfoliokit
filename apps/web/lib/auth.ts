import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { env } from "@repo/env";

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
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/v1/gateway/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

async function refreshToken(
  token: string
): Promise<GatewayAuthResponse | null> {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/v1/gateway/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const result = await loginToGateway(
          credentials.email as string,
          credentials.password as string
        );

        if (!result || !result.success) {
          return null;
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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email_confirmed = user.email_confirmed;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
      }

      if (trigger === "update" && token.refresh_token) {
        const refreshed = await refreshToken(token.refresh_token as string);
        if (refreshed && refreshed.success) {
          token.access_token = refreshed.session.access_token;
          token.refresh_token = refreshed.session.refresh_token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email_confirmed = token.email_confirmed as boolean;
        session.access_token = token.access_token as string;
        session.refresh_token = token.refresh_token as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/register",
  },
  secret: env.NEXTAUTH_SECRET,
});
