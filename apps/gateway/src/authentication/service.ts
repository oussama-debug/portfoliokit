import type { Session, User } from "./model";
import type { AuthenticationRepository } from "./repository";

export class AuthenticationService {
  constructor(private readonly _authRepository: AuthenticationRepository) {}

  async register(username: string, password: string): Promise<{ user: User; session: Session }> {
    return await this._authRepository.create(username, password);
  }

  async login(username: string, password: string): Promise<{ user: User; session: Session }> {
    return await this._authRepository.login(username, password);
  }

  async signout(token: string): Promise<void> {
    return await this._authRepository.signout(token);
  }

  async verify(token: string): Promise<User> {
    return await this._authRepository.verify(token);
  }

  async refresh(token: string): Promise<{ user: User; session: Session }> {
    return await this._authRepository.refresh(token);
  }
}
