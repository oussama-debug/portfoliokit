import type { Context } from "hono";
import type { User } from "@/authentication/model.js";
import { InternalError } from "@/error.js";

export interface ApplicationContext {
  Variables: {
    user?: ReturnType<User["toObject"]>;
    requestId?: string;
  };
}

export function getUser(context: Context): ReturnType<User["toObject"]> {
  const user = context.get("user");
  if (!user) {
    throw new InternalError(
      "User not found in context. Did you forget to use isAuthenticated middleware?"
    );
  }
  return user;
}
