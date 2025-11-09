import type { Workspace, WorkspaceMember, Organization, OrganizationMember } from "./model.js";

export interface WorkspaceRepository {
  createWorkspace(
    organizationId: string,
    name: string,
    slug: string,
    description: string | null,
    timezone: string
  ): Promise<Workspace>;
  findWorkspaceById(id: string): Promise<Workspace | null>;
  findWorkspaceBySlug(organizationId: string, slug: string): Promise<Workspace | null>;
  findWorkspacesByOrganization(organizationId: string): Promise<Workspace[]>;
  findWorkspacesByUser(userId: string): Promise<Workspace[]>;
  updateWorkspace(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      timezone?: string;
      isActive?: boolean;
    }
  ): Promise<Workspace>;
  deleteWorkspace(id: string): Promise<void>;

  addWorkspaceMember(
    workspaceId: string,
    userId: string,
    role: "owner" | "admin" | "member"
  ): Promise<WorkspaceMember>;
  findWorkspaceMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null>;
  findWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]>;
  updateWorkspaceMemberRole(
    workspaceId: string,
    userId: string,
    role: "owner" | "admin" | "member"
  ): Promise<WorkspaceMember>;
  removeWorkspaceMember(workspaceId: string, userId: string): Promise<void>;

  createOrganization(name: string, slug: string, description: string | null): Promise<Organization>;
  findOrganizationById(id: string): Promise<Organization | null>;
  findOrganizationBySlug(slug: string): Promise<Organization | null>;
  findOrganizationsByUser(userId: string): Promise<Organization[]>;
  updateOrganization(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      logoUrl?: string | null;
    }
  ): Promise<Organization>;
  deleteOrganization(id: string): Promise<void>;

  addOrganizationMember(
    organizationId: string,
    userId: string,
    role: "owner" | "admin" | "member"
  ): Promise<OrganizationMember>;
  findOrganizationMember(
    organizationId: string,
    userId: string
  ): Promise<OrganizationMember | null>;
  findOrganizationMembers(organizationId: string): Promise<OrganizationMember[]>;
  updateOrganizationMemberRole(
    organizationId: string,
    userId: string,
    role: "owner" | "admin" | "member"
  ): Promise<OrganizationMember>;
  removeOrganizationMember(organizationId: string, userId: string): Promise<void>;
}
