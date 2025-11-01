import { InternalError } from "./error.js";
import { SupabaseAuthenticationRepository } from "./authentication/repositories/supabase.repository.js";
import { AuthenticationService } from "./authentication/service.js";

export class Application {
  private static _authenticationService: AuthenticationService;
  private static _supabaseAuthenticationService: SupabaseAuthenticationRepository;

  static initialize(supabaseUrl: string, supabaseKey: string) {
    this._supabaseAuthenticationService = new SupabaseAuthenticationRepository(
      supabaseUrl,
      supabaseKey
    );
    this._authenticationService = new AuthenticationService(
      this._supabaseAuthenticationService
    );
  }

  static get authenticationService(): AuthenticationService {
    if (!this._authenticationService) {
      throw new InternalError(
        "AuthenticationService not initialized. Call Application.initialize() first."
      );
    }
    return this._authenticationService;
  }
}
