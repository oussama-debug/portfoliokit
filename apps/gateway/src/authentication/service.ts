import { type User } from "./model.js";
import { AuthenticationRepository } from "./repository.js";

export class AuthenticationService {
  constructor(private readonly _authRepository: AuthenticationRepository) {}

  async register(username: string, password: string): Promise<void> {
    await this._authRepository.create(username, password);
  }
}
