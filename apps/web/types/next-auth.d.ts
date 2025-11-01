import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email_confirmed: boolean;
    } & DefaultSession["user"];
    access_token: string;
    refresh_token: string;
  }

  interface User {
    id: string;
    username: string;
    email: string;
    email_confirmed: boolean;
    access_token: string;
    refresh_token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email_confirmed: boolean;
    access_token: string;
    refresh_token: string;
  }
}
