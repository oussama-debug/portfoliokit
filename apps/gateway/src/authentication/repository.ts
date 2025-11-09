import type { Session, User } from "./model";

export interface AuthenticationRepository {
  create(username: string, password: string): Promise<{ user: User; session: Session }>;
  login(username: string, password: string): Promise<{ user: User; session: Session }>;
  signout(token: string): Promise<void>;
  verify(token: string): Promise<User>;
  refresh(token: string): Promise<{ user: User; session: Session }>;
}
