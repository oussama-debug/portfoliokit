import { type User as SupabaseUser } from "@supabase/supabase-js";
import { type Session as SupabaseSession } from "@supabase/supabase-js";

export class User {
  private _id: string;
  private _username: string;
  private _createdAt: Date;
  private _email_confirmed: boolean;

  constructor(
    id: string,
    username: string,
    createdAt: Date,
    email_confirmed: boolean
  ) {
    this._id = id;
    this._username = username;
    this._createdAt = createdAt;
    this._email_confirmed = email_confirmed;
  }

  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get email_confirmed(): boolean {
    return this._email_confirmed;
  }

  toObject() {
    return {
      id: this.id,
      username: this.username,
      createdAt: this.createdAt,
      email_confirmed: this.email_confirmed,
    };
  }

  static fromSupabaseUser(supabaseUser: SupabaseUser): User {
    return new User(
      supabaseUser.id,
      supabaseUser.email || "",
      new Date(supabaseUser.created_at),
      supabaseUser.email_confirmed_at !== null
    );
  }
}

export class Session {
  private _access_token: string;
  private _refresh_token: string;

  constructor(access_token: string, refresh_token: string) {
    this._access_token = access_token;
    this._refresh_token = refresh_token;
  }

  get access_token(): string {
    return this._access_token;
  }

  get refresh_token(): string {
    return this._refresh_token;
  }

  static fromSupabaseSession(supabaseSession: SupabaseSession): Session {
    return new Session(
      supabaseSession.access_token,
      supabaseSession.refresh_token
    );
  }
}
