import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@repo/env";

export type APIUser = {
  id: string;
  username: string;
  createdAt: string;
  email_confirmed: boolean;
};

export type APISession = {
  access_token: string;
  refresh_token: string;
};

export type AuthenticationResult = {
  user: APIUser;
  session: APISession;
};

export async function authenticate(
  username: string,
  password: string
): Promise<AuthenticationResult | null> {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/v1/gateway/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data;
}

export async function refresh(
  token: string
): Promise<AuthenticationResult | null> {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/v1/gateway/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    }
  );
  if (!response.ok) return null;

  const data = await response.json();
  return data;
}

export const auth_options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials?.email || !credentials?.password) return null;

        const result = await authenticate(
          credentials.email,
          credentials.password
        );

        if (!result) return null;

        return {
          id: result?.user.id,
          username: result?.user.username,
          confirmed: result?.user.email_confirmed,
          access_token: result?.session.access_token,
          refresh_token: result?.session.refresh_token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          confirmed: user.email_confirmed,
        };
      }
      return await refresh(token.refresh_token);
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.access_token = token.access_token;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  secret: env.NEXTAUTH_SECRET,
};
