export class Workspace {
  constructor(
    private readonly _id: string,
    private readonly _organizationId: string,
    private readonly _name: string,
    private readonly _slug: string,
    private readonly _description: string | null,
    private readonly _timezone: string,
    private readonly _isActive: boolean,
    private readonly _createdAt: Date
  ) {}

  get id(): string {
    return this._id;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string | null {
    return this._description;
  }

  get timezone(): string {
    return this._timezone;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  toObject() {
    return {
      id: this._id,
      organizationId: this._organizationId,
      name: this._name,
      slug: this._slug,
      description: this._description,
      timezone: this._timezone,
      isActive: this._isActive,
      createdAt: this._createdAt.toISOString(),
    };
  }
}

export class WorkspaceMember {
  constructor(
    private readonly _id: string,
    private readonly _workspaceId: string,
    private readonly _userId: string,
    private readonly _role: "owner" | "admin" | "member",
    private readonly _createdAt: Date
  ) {}

  get id(): string {
    return this._id;
  }

  get workspaceId(): string {
    return this._workspaceId;
  }

  get userId(): string {
    return this._userId;
  }

  get role(): "owner" | "admin" | "member" {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  toObject() {
    return {
      id: this._id,
      workspaceId: this._workspaceId,
      userId: this._userId,
      role: this._role,
      createdAt: this._createdAt.toISOString(),
    };
  }
}

export class Organization {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _slug: string,
    private readonly _description: string | null,
    private readonly _logoUrl: string | null,
    private readonly _createdAt: Date
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string | null {
    return this._description;
  }

  get logoUrl(): string | null {
    return this._logoUrl;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  toObject() {
    return {
      id: this._id,
      name: this._name,
      slug: this._slug,
      description: this._description,
      logoUrl: this._logoUrl,
      createdAt: this._createdAt.toISOString(),
    };
  }
}

export class OrganizationMember {
  constructor(
    private readonly _id: string,
    private readonly _organizationId: string,
    private readonly _userId: string,
    private readonly _role: "owner" | "admin" | "member",
    private readonly _createdAt: Date
  ) {}

  get id(): string {
    return this._id;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get userId(): string {
    return this._userId;
  }

  get role(): "owner" | "admin" | "member" {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  toObject() {
    return {
      id: this._id,
      organizationId: this._organizationId,
      userId: this._userId,
      role: this._role,
      createdAt: this._createdAt.toISOString(),
    };
  }
}
