import { env } from "@repo/environment";

const GATEWAY_URL =
  env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export interface GatewayAuthResponse {
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
}

export const gatewayClient = {
  async signUp(
    username: string,
    password: string
  ): Promise<GatewayAuthResponse> {
    const response = await fetch(`${GATEWAY_URL}/v1/gateway/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Registration failed" }));
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  async signIn(
    username: string,
    password: string
  ): Promise<GatewayAuthResponse> {
    const response = await fetch(`${GATEWAY_URL}/v1/gateway/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Login failed" }));
      throw new Error(error.message || "Invalid credentials");
    }

    return response.json();
  },

  async signOut(token: string): Promise<void> {
    const response = await fetch(`${GATEWAY_URL}/v1/gateway/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },

  async refreshToken(token: string): Promise<GatewayAuthResponse> {
    const response = await fetch(`${GATEWAY_URL}/v1/gateway/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    return response.json();
  },

  async verifyToken(token: string): Promise<GatewayAuthResponse["user"]> {
    const response = await fetch(`${GATEWAY_URL}/v1/gateway/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    const data = await response.json();
    return data.user;
  },
};
