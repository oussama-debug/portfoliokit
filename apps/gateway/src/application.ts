import { Container } from "./core/index.js";
import type { AuthenticationService } from "./authentication/service.js";

export class Application {
  static get authenticationService(): AuthenticationService {
    return Container.resolve<AuthenticationService>("AuthenticationService");
  }
}
