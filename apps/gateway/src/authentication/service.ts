import { BaseService } from "@/core/base.js";
import type { Session, User } from "./model.js";
import type { AuthenticationRepository } from "./repository.js";

export class AuthenticationService extends BaseService {
  constructor(private readonly _authRepository: AuthenticationRepository) {
    super("AuthenticationService");
  }

  async register(username: string, password: string): Promise<{ user: User; session: Session }> {
    this.log(`Registering user: ${username}`);
    return await this._authRepository.create(username, password);
  }

  async login(username: string, password: string): Promise<{ user: User; session: Session }> {
    this.log(`User login attempt: ${username}`);
    return await this._authRepository.login(username, password);
  }

  async signout(token: string): Promise<void> {
    this.log("User signout");
    return await this._authRepository.signout(token);
  }

  async verify(token: string): Promise<User> {
    return await this._authRepository.verify(token);
  }

  async refresh(token: string): Promise<{ user: User; session: Session }> {
    this.log("Token refresh");
    return await this._authRepository.refresh(token);
  }
}
