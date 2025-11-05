import { SupabaseAuthenticationRepository } from "./authentication/repositories/supabase.repository";
import { AuthenticationService } from "./authentication/service";
import { InternalError } from "./error";

export class Application {
  private static _authenticationService: AuthenticationService;
  private static _supabaseAuthenticationService: SupabaseAuthenticationRepository;

  static initialize(supabaseUrl: string, supabaseKey: string) {
    Application._supabaseAuthenticationService = new SupabaseAuthenticationRepository(
      supabaseUrl,
      supabaseKey
    );
    Application._authenticationService = new AuthenticationService(
      Application._supabaseAuthenticationService
    );
  }

  static get authenticationService(): AuthenticationService {
    if (!Application._authenticationService) {
      throw new InternalError(
        "AuthenticationService not initialized. Call Application.initialize() first."
      );
    }
    return Application._authenticationService;
  }
}
