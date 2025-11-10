import { BaseService } from "@repo/core/base";
import { NotFoundError, ForbiddenError } from "@repo/core/error";
import type { Workspace, WorkspaceMember, Organization, OrganizationMember } from "./model.js";
import type { WorkspaceRepository } from "./repository.js";

export class WorkspaceService extends BaseService {
  constructor(private readonly _repository: WorkspaceRepository) {
    super("WorkspaceService");
  }

  async createWorkspace(
    userId: string,
    organizationId: string,
    name: string,
    slug: string,
    description: string | null = null,
    timezone: string = "UTC"
  ): Promise<{ workspace: Workspace; member: WorkspaceMember }> {
    this.log(`Creating workspace: ${name} in organization: ${organizationId}`);

    const orgMember = await this._repository.findOrganizationMember(organizationId, userId);
    if (!orgMember) {
      throw new ForbiddenError("You must be a member of the organization to create workspaces");
    }

    if (!["admin", "owner"].includes(orgMember.role)) {
      throw new ForbiddenError("Only organization admins and owners can create workspaces");
    }

    const workspace = await this._repository.createWorkspace(
      organizationId,
      name,
      slug,
      description,
      timezone
    );

    const member = await this._repository.addWorkspaceMember(workspace.id, userId, "owner");

    return { workspace, member };
  }

  async getWorkspaceById(id: string, userId: string): Promise<Workspace> {
    const workspace = await this._repository.findWorkspaceById(id);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    await this.verifyWorkspaceAccess(userId, id);

    return workspace;
  }

  async getWorkspaceBySlug(
    organizationId: string,
    slug: string,
    userId?: string
  ): Promise<Workspace> {
    const workspace = await this._repository.findWorkspaceBySlug(organizationId, slug);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    if (userId) {
      await this.verifyWorkspaceAccess(userId, workspace.id);
    }

    return workspace;
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    this.log(`Fetching workspaces for user: ${userId}`);
    return await this._repository.findWorkspacesByUser(userId);
  }

  async getOrganizationWorkspaces(organizationId: string, userId: string): Promise<Workspace[]> {
    const orgMember = await this._repository.findOrganizationMember(organizationId, userId);
    if (!orgMember) {
      throw new ForbiddenError("You don't have access to this organization");
    }

    return await this._repository.findWorkspacesByOrganization(organizationId);
  }

  async updateWorkspace(
    id: string,
    userId: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      timezone?: string;
      isActive?: boolean;
    }
  ): Promise<Workspace> {
    const workspace = await this._repository.findWorkspaceById(id);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    const member = await this._repository.findWorkspaceMember(id, userId);
    if (!member || !["admin", "owner"].includes(member.role)) {
      throw new ForbiddenError("Only workspace admins and owners can update workspace settings");
    }

    this.log(`Updating workspace: ${id}`);
    return await this._repository.updateWorkspace(id, data);
  }

  async deleteWorkspace(id: string, userId: string): Promise<void> {
    const workspace = await this._repository.findWorkspaceById(id);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    const member = await this._repository.findWorkspaceMember(id, userId);
    if (!member || member.role !== "owner") {
      throw new ForbiddenError("Only workspace owners can delete workspaces");
    }

    this.log(`Deleting workspace: ${id}`);
    await this._repository.deleteWorkspace(id);
  }

  async addWorkspaceMember(
    workspaceId: string,
    userId: string,
    targetUserId: string,
    role: "admin" | "member" = "member"
  ): Promise<WorkspaceMember> {
    const requesterMember = await this._repository.findWorkspaceMember(workspaceId, userId);
    if (!requesterMember || !["admin", "owner"].includes(requesterMember.role)) {
      throw new ForbiddenError("Only workspace admins and owners can add members");
    }

    const existingMember = await this._repository.findWorkspaceMember(workspaceId, targetUserId);
    if (existingMember) {
      throw new Error("User is already a member of this workspace");
    }

    this.log(`Adding member ${targetUserId} to workspace: ${workspaceId}`);
    return await this._repository.addWorkspaceMember(workspaceId, targetUserId, role);
  }

  async getWorkspaceMembers(workspaceId: string, userId: string): Promise<WorkspaceMember[]> {
    await this.verifyWorkspaceAccess(userId, workspaceId);

    return await this._repository.findWorkspaceMembers(workspaceId);
  }

  async updateWorkspaceMemberRole(
    workspaceId: string,
    userId: string,
    targetUserId: string,
    role: "owner" | "admin" | "member"
  ): Promise<WorkspaceMember> {
    const requesterMember = await this._repository.findWorkspaceMember(workspaceId, userId);
    if (!requesterMember || requesterMember.role !== "owner") {
      throw new ForbiddenError("Only workspace owners can change member roles");
    }

    if (userId === targetUserId) {
      throw new Error("You cannot change your own role");
    }

    this.log(`Updating member ${targetUserId} role in workspace: ${workspaceId}`);
    return await this._repository.updateWorkspaceMemberRole(workspaceId, targetUserId, role);
  }

  async removeWorkspaceMember(
    workspaceId: string,
    userId: string,
    targetUserId: string
  ): Promise<void> {
    const requesterMember = await this._repository.findWorkspaceMember(workspaceId, userId);
    if (!requesterMember || !["admin", "owner"].includes(requesterMember.role)) {
      throw new ForbiddenError("Only workspace admins and owners can remove members");
    }

    if (userId === targetUserId) {
      const members = await this._repository.findWorkspaceMembers(workspaceId);
      const owners = members.filter((m) => m.role === "owner");
      if (owners.length === 1 && owners[0]?.userId === userId) {
        throw new Error("Cannot remove the last owner. Transfer ownership first.");
      }
    }

    this.log(`Removing member ${targetUserId} from workspace: ${workspaceId}`);
    await this._repository.removeWorkspaceMember(workspaceId, targetUserId);
  }

  async createOrganization(
    userId: string,
    name: string,
    slug: string,
    description: string | null = null
  ): Promise<{ organization: Organization; member: OrganizationMember }> {
    this.log(`Creating organization: ${name}`);

    const organization = await this._repository.createOrganization(name, slug, description);

    const member = await this._repository.addOrganizationMember(organization.id, userId, "owner");

    return { organization, member };
  }

  async getOrganizationById(id: string, userId: string): Promise<Organization> {
    const organization = await this._repository.findOrganizationById(id);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const member = await this._repository.findOrganizationMember(id, userId);
    if (!member) {
      throw new ForbiddenError("You don't have access to this organization");
    }

    return organization;
  }

  async getOrganizationBySlug(slug: string, userId?: string): Promise<Organization> {
    const organization = await this._repository.findOrganizationBySlug(slug);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    if (userId) {
      const member = await this._repository.findOrganizationMember(organization.id, userId);
      if (!member) {
        throw new ForbiddenError("You don't have access to this organization");
      }
    }

    return organization;
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    this.log(`Fetching organizations for user: ${userId}`);
    return await this._repository.findOrganizationsByUser(userId);
  }

  async updateOrganization(
    id: string,
    userId: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      logoUrl?: string | null;
    }
  ): Promise<Organization> {
    const organization = await this._repository.findOrganizationById(id);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const member = await this._repository.findOrganizationMember(id, userId);
    if (!member || !["admin", "owner"].includes(member.role)) {
      throw new ForbiddenError("Only organization admins and owners can update settings");
    }

    this.log(`Updating organization: ${id}`);
    return await this._repository.updateOrganization(id, data);
  }

  async deleteOrganization(id: string, userId: string): Promise<void> {
    const organization = await this._repository.findOrganizationById(id);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const member = await this._repository.findOrganizationMember(id, userId);
    if (!member || member.role !== "owner") {
      throw new ForbiddenError("Only organization owners can delete organizations");
    }

    this.log(`Deleting organization: ${id}`);
    await this._repository.deleteOrganization(id);
  }

  async addOrganizationMember(
    organizationId: string,
    userId: string,
    targetUserId: string,
    role: "admin" | "member" = "member"
  ): Promise<OrganizationMember> {
    const requesterMember = await this._repository.findOrganizationMember(organizationId, userId);
    if (!requesterMember || !["admin", "owner"].includes(requesterMember.role)) {
      throw new ForbiddenError("Only organization admins and owners can add members");
    }

    const existingMember = await this._repository.findOrganizationMember(
      organizationId,
      targetUserId
    );
    if (existingMember) {
      throw new Error("User is already a member of this organization");
    }

    this.log(`Adding member ${targetUserId} to organization: ${organizationId}`);
    return await this._repository.addOrganizationMember(organizationId, targetUserId, role);
  }

  async getOrganizationMembers(
    organizationId: string,
    userId: string
  ): Promise<OrganizationMember[]> {
    const member = await this._repository.findOrganizationMember(organizationId, userId);
    if (!member) {
      throw new ForbiddenError("You don't have access to this organization");
    }

    return await this._repository.findOrganizationMembers(organizationId);
  }

  async updateOrganizationMemberRole(
    organizationId: string,
    userId: string,
    targetUserId: string,
    role: "owner" | "admin" | "member"
  ): Promise<OrganizationMember> {
    const requesterMember = await this._repository.findOrganizationMember(organizationId, userId);
    if (!requesterMember || requesterMember.role !== "owner") {
      throw new ForbiddenError("Only organization owners can change member roles");
    }

    if (userId === targetUserId) {
      throw new Error("You cannot change your own role");
    }

    this.log(`Updating member ${targetUserId} role in organization: ${organizationId}`);
    return await this._repository.updateOrganizationMemberRole(organizationId, targetUserId, role);
  }

  async removeOrganizationMember(
    organizationId: string,
    userId: string,
    targetUserId: string
  ): Promise<void> {
    const requesterMember = await this._repository.findOrganizationMember(organizationId, userId);
    if (!requesterMember || !["admin", "owner"].includes(requesterMember.role)) {
      throw new ForbiddenError("Only organization admins and owners can remove members");
    }

    if (userId === targetUserId) {
      const members = await this._repository.findOrganizationMembers(organizationId);
      const owners = members.filter((m) => m.role === "owner");
      if (owners.length === 1 && owners[0]?.userId === userId) {
        throw new Error("Cannot remove the last owner. Transfer ownership first.");
      }
    }

    this.log(`Removing member ${targetUserId} from organization: ${organizationId}`);
    await this._repository.removeOrganizationMember(organizationId, targetUserId);
  }

  async verifyWorkspaceAccess(userId: string, workspaceId: string): Promise<boolean> {
    const member = await this._repository.findWorkspaceMember(workspaceId, userId);
    if (!member) {
      throw new ForbiddenError("You don't have access to this workspace");
    }
    return true;
  }

  async verifyOrganizationAccess(userId: string, organizationId: string): Promise<boolean> {
    const member = await this._repository.findOrganizationMember(organizationId, userId);
    if (!member) {
      throw new ForbiddenError("You don't have access to this organization");
    }
    return true;
  }
}
