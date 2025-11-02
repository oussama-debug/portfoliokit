import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import { AuthenticationRepository } from "../repository.js";
import { Session, User } from "../model.js";
import {
  CreateUserError,
  InternalError,
  InvalidCredentialsError,
  TokenRefreshError,
} from "../../error.js";
import { Database } from "@repo/supabase";

export class SupabaseAuthenticationRepository
  implements AuthenticationRepository
{
  private _supabaseClient: SupabaseClient;

  constructor(_supabaseUrl: string, _supabaseKey: string) {
    this._supabaseClient = createClient<Database>(_supabaseUrl, _supabaseKey);
  }

  async create(
    username: string,
    password: string
  ): Promise<{ user: User; session: Session }> {
    const { data, error } = await this._supabaseClient.auth.signUp({
      email: username,
      password: password,
    });

    if (error || !data.user) {
      throw new CreateUserError(`Failed to create user: ${error?.message}`);
    }

    if (!data.session) {
      const { data: signIn, error: signInError } =
        await this._supabaseClient.auth.signInWithPassword({
          email: username,
          password: password,
        });

      if (signInError || !signIn.session) {
        throw new CreateUserError(
          `User created but failed to create session: ${signInError?.message}`
        );
      }

      return {
        user: User.fromSupabaseUser(data.user),
        session: Session.fromSupabaseSession(signIn.session),
      };
    }

    return {
      user: User.fromSupabaseUser(data.user),
      session: Session.fromSupabaseSession(data.session),
    };
  }

  async login(
    username: string,
    password: string
  ): Promise<{ user: User; session: Session }> {
    const { data, error } = await this._supabaseClient.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error || !data.user) {
      throw new InvalidCredentialsError(
        `Failed to login user: ${error?.message}`
      );
    }

    return {
      user: User.fromSupabaseUser(data.user),
      session: Session.fromSupabaseSession(data.session!),
    };
  }

  async signout(token: string): Promise<void> {
    const { error } = await this._supabaseClient.auth.admin.signOut(token);
    if (error) {
      throw new InternalError(`Failed to sign out user: ${error.message}`);
    }
  }

  async verify(token: string): Promise<User> {
    const { data, error } = await this._supabaseClient.auth.getUser(token);
    if (error)
      throw new InternalError(`Failed to verify token: ${error.message}`);
    if (!data.user)
      throw new InvalidCredentialsError(`Invalid token: no user found`);
    return User.fromSupabaseUser(data.user);
  }

  async refresh(token: string): Promise<{ user: User; session: Session }> {
    const { data, error } = await this._supabaseClient.auth.refreshSession({
      refresh_token: token,
    });

    if (error)
      throw new TokenRefreshError(`Failed to refresh token: ${error.message}`);
    if (!data.user || !data.session)
      throw new TokenRefreshError("Refresh failed");

    return {
      user: User.fromSupabaseUser(data.user),
      session: Session.fromSupabaseSession(data.session!),
    };
  }
}
