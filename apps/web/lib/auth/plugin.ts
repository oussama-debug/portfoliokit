import { type BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";
import { z } from "zod";
import { gatewayClient } from "./gateway";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signOutSchema = z.object({
  token: z.string(),
});

const refreshSchema = z.object({
  token: z.string(),
});

const zenlanes = () => {
  return {
    id: "zenlanes",
    endpoints: {
      signUp: createAuthEndpoint(
        "/api/auth/sign-up",
        {
          method: "POST",
          body: signUpSchema,
        },
        async (ctx) => {
          const { email, password } = ctx.body;

          try {
            const data = await gatewayClient.signUp(email, password);

            return ctx.json({
              success: data.success,
              user: data.user,
              session: data.session,
            });
          } catch (error) {
            return ctx.json(
              {
                success: false,
                error: error instanceof Error ? error.message : "Registration failed",
              },
              { status: 400 }
            );
          }
        }
      ),

      signIn: createAuthEndpoint(
        "/api/auth/sign-in/email",
        {
          method: "POST",
          body: signInSchema,
        },
        async (ctx) => {
          const { email, password } = ctx.body;

          try {
            const data = await gatewayClient.signIn(email, password);

            return ctx.json({
              success: data.success,
              user: data.user,
              session: data.session,
            });
          } catch (error) {
            return ctx.json(
              {
                success: false,
                error: error instanceof Error ? error.message : "Login failed",
              },
              { status: 401 }
            );
          }
        }
      ),

      signOut: createAuthEndpoint(
        "/api/auth/sign-out",
        {
          method: "POST",
          body: signOutSchema,
        },
        async (ctx) => {
          const { token } = ctx.body;

          try {
            await gatewayClient.signOut(token);

            return ctx.json({ success: true });
          } catch (error) {
            return ctx.json(
              {
                success: false,
                error: error instanceof Error ? error.message : "Sign out failed",
              },
              { status: 400 }
            );
          }
        }
      ),

      getSession: createAuthEndpoint(
        "/api/auth/session",
        {
          method: "GET",
        },
        async (ctx) => {
          const authHeader = ctx.request?.headers.get("Authorization");
          const token = authHeader?.replace("Bearer ", "") || ctx.query?.token;

          if (!token) {
            return ctx.json(
              {
                success: false,
                error: "No token provided",
              },
              { status: 401 }
            );
          }

          try {
            const user = await gatewayClient.verifyToken(token);

            return ctx.json({
              success: true,
              user: user,
            });
          } catch (error) {
            return ctx.json(
              {
                success: false,
                error: error instanceof Error ? error.message : "Session verification failed",
              },
              { status: 401 }
            );
          }
        }
      ),

      refresh: createAuthEndpoint(
        "/api/auth/refresh",
        {
          method: "POST",
          body: refreshSchema,
        },
        async (ctx) => {
          const { token } = ctx.body;

          try {
            const data = await gatewayClient.refreshToken(token);

            return ctx.json({
              success: data.success,
              user: data.user,
              session: data.session,
            });
          } catch (error) {
            return ctx.json(
              {
                success: false,
                error: error instanceof Error ? error.message : "Token refresh failed",
              },
              { status: 401 }
            );
          }
        }
      ),
    },
  } satisfies BetterAuthPlugin;
};

export { zenlanes };
