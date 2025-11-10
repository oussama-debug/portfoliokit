import type { Context } from "hono";

export interface ApplicationContext {
  Variables: {
    user?: {
      id: string;
      username: string;
      createdAt: string;
      email_confirmed: boolean;
    };
    requestId?: string;
  };
}

export function getUser(context: Context): {
  id: string;
  username: string;
  createdAt: string;
  email_confirmed: boolean;
} {
  const user = context.get("user");
  if (!user) {
    throw new Error("User not found in context. Did you forget to use isAuthenticated middleware?");
  }
  return user;
}
