export class InvalidCredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class CreateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateUserError";
  }
}

export class InternalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalError";
  }
}

export class TokenVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenVerificationError";
  }
}

export class TokenRefreshError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenRefreshError";
  }
}
