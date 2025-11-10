import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NotFoundError, InternalError } from "@repo/core/error";
import type { WorkspaceRepository } from "../repository.js";
import {
  Workspace,
  WorkspaceMember,
  Organization,
  OrganizationMember,
} from "../model.js";
import type { Database } from "@repo/supabase";

export class SupabaseWorkspaceRepository implements WorkspaceRepository {
  private readonly _client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this._client = createClient<Database>(supabaseUrl, supabaseKey);
  }

  async createWorkspace(
    organizationId: string,
    name: string,
    slug: string,
    description: string | null,
    timezone: string
  ): Promise<Workspace> {
    const { data, error } = await this._client
      .from("workspaces")
      .insert({
        organization_id: organizationId,
        name,
        slug,
        description,
        timezone,
      })
      .select()
      .single();

    if (error) {
      throw new InternalError(`Failed to create workspace: ${error.message}`);
    }

    return new Workspace(
      data.id,
      data.organization_id,
      data.name,
      data.slug,
      data.description,
      data.timezone,
      data.is_active,
      new Date(data.created_at)
    );
  }

  async findWorkspaceById(id: string): Promise<Workspace | null> {
    const { data, error } = await this._client
      .from("workspaces")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new InternalError(`Failed to fetch workspace: ${error.message}`);
    }

    return new Workspace(
      data.id,
      data.organization_id,
      data.name,
      data.slug,
      data.description,
      data.timezone,
      data.is_active,
      new Date(data.created_at)
    );
  }

  async findWorkspaceBySlug(
    organizationId: string,
    slug: string
  ): Promise<Workspace | null> {
    const { data, error } = await this._client
      .from("workspaces")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new InternalError(`Failed to fetch workspace: ${error.message}`);
    }

    return new Workspace(
      data.id,
      data.organization_id,
      data.name,
      data.slug,
      data.description,
      data.timezone,
      data.is_active,
      new Date(data.created_at)
    );
  }

  async findWorkspacesByOrganization(
    organizationId: string
  ): Promise<Workspace[]> {
    const { data, error } = await this._client
      .from("workspaces")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new InternalError(`Failed to fetch workspaces: ${error.message}`);
    }

    return data.map(
      (item) =>
        new Workspace(
          item.id,
          item.organization_id,
          item.name,
          item.slug,
          item.description,
          item.timezone,
          item.is_active,
          new Date(item.created_at)
        )
    );
  }

  async findWorkspacesByUser(userId: string): Promise<Workspace[]> {
    const { data, error } = await this._client
      .from("workspace_members")
      .select("workspaces(*)")
      .eq("user_id", userId);

    if (error) {
      throw new InternalError(
        `Failed to fetch user workspaces: ${error.message}`
      );
    }

    return data
      .filter((item) => item.workspaces)
      .map((item) => {
        const ws = item.workspaces as any;
        return new Workspace(
          ws.id,
          ws.organization_id,
          ws.name,
          ws.slug,
          ws.description,
          ws.timezone,
          ws.is_active,
          new Date(ws.created_at)
        );
      });
  }

  async updateWorkspace(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      timezone?: string;
      isActive?: boolean;
    }
  ): Promise<Workspace> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.timezone !== undefined) updateData.timezone = data.timezone;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;
    updateData.updated_at = new Date().toISOString();

    const { data: result, error } = await this._client
      .from("workspaces")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new InternalError(`Failed to update workspace: ${error.message}`);
    }

    if (!result) {
      throw new NotFoundError("Workspace not found");
    }

    return new Workspace(
      result.id,
      result.organization_id,
      result.name,
      result.slug,
      result.description,
      result.timezone,
      result.is_active,
      new Date(result.created_at)
    );
  }

  async deleteWorkspace(id: string): Promise<void> {
    const { error } = await this._client
      .from("workspaces")
      .delete()
      .eq("id", id);

    if (error) {
      throw new InternalError(`Failed to delete workspace: ${error.message}`);
    }
  }

  async addWorkspaceMember(
    workspaceId: string,
    userId: string,
    role: "owner" | "admin" | "member"
  ): Promise<WorkspaceMember> {
    const { data, error } = await this._client
      .from("workspace_members")
      .insert({
        workspace_id: workspaceId,
        user_id: userId,
        role,
      })
      .select()
      .single();

    if (error) {
      throw new InternalError(
        `Failed to add workspace member: ${error.message}`
      );
    }

    return new WorkspaceMember(
      data.id,
      data.workspace_id,
      data.user_id,
      data.role,
      new Date(data.created_at)
    );
  }

  async findWorkspaceMember(
    workspaceId: string,
    userId: string
  ): Promise<WorkspaceMember | null> {
    const { data, error } = await this._client
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new InternalError(
        `Failed to fetch workspace member: ${error.message}`
      );
    }

    return new WorkspaceMember(
      data.id,
      data.workspace_id,
      data.user_id,
      data.role,
      new Date(data.created_at)
    );
  }

  async findWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const { data, error } = await this._client
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new InternalError(
        `Failed to fetch workspace members: ${error.message}`
      );
    }

    return data.map(
      (item) =>
        new WorkspaceMember(
          item.id,
          item.workspace_id,
          item.user_id,
          item.role,
          new Date(item.created_at)
        )
    );
  }

  async updateWorkspaceMemberRole(
    workspaceId: string,
    userId: string,
    role: "owner" | "admin" | "member"
  ): Promise<WorkspaceMember> {
    const { data, error } = await this._client
      .from("workspace_members")
      .update({ role })
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new InternalError(
        `Failed to update workspace member role: ${error.message}`
      );
    }

    return new WorkspaceMember(
      data.id,
      data.workspace_id,
      data.user_id,
      data.role,
      new Date(data.created_at)
    );
  }

  async removeWorkspaceMember(
    workspaceId: string,
    userId: string
  ): Promise<void> {
    const { error } = await this._client
      .from("workspace_members")
      .delete()
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId);

    if (error) {
      throw new InternalError(
        `Failed to remove workspace member: ${error.message}`
      );
    }
  }

  async createOrganization(
    name: string,
    slug: string,
    description: string | null
  ): Promise<Organization> {
    const { data, error } = await this._client
      .from("organizations")
      .insert({
        name,
        slug,
        description,
      })
      .select()
      .single();

    if (error) {
      throw new InternalError(
        `Failed to create organization: ${error.message}`
      );
    }

    return new Organization(
      data.id,
      data.name,
      data.slug,
      data.description,
      data.logo_url,
      new Date(data.created_at)
    );
  }

  async findOrganizationById(id: string): Promise<Organization | null> {
    const { data, error } = await this._client
      .from("organizations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new InternalError(`Failed to fetch organization: ${error.message}`);
    }

    return new Organization(
      data.id,
      data.name,
      data.slug,
      data.description,
      data.logo_url,
      new Date(data.created_at)
    );
  }

  async findOrganizationBySlug(slug: string): Promise<Organization | null> {
    const { data, error } = await this._client
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new InternalError(`Failed to fetch organization: ${error.message}`);
    }

    return new Organization(
      data.id,
      data.name,
      data.slug,
      data.description,
      data.logo_url,
      new Date(data.created_at)
    );
  }

  async findOrganizationsByUser(userId: string): Promise<Organization[]> {
    const { data, error } = await this._client
      .from("organization_members")
      .select("organizations(*)")
      .eq("user_id", userId);

    if (error) {
      throw new InternalError(
        `Failed to fetch user organizations: ${error.message}`
      );
    }

    return data
      .filter((item) => item.organizations)
      .map((item) => {
        const org = item.organizations as any;
        return new Organization(
          org.id,
          org.name,
          org.slug,
          org.description,
          org.logo_url,
          new Date(org.created_at)
        );
      });
  }

  async updateOrganization(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      logoUrl?: string | null;
    }
  ): Promise<Organization> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.logoUrl !== undefined) updateData.logo_url = data.logoUrl;
    updateData.updated_at = new Date().toISOString();

    const { data: result, error } = await this._client
      .from("organizations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new InternalError(
        `Failed to update organization: ${error.message}`
      );
    }

    if (!result) {
      throw new NotFoundError("Organization not found");
    }

    return new Organization(
      result.id,
      result.name,
      result.slug,
      result.description,
      result.logo_url,
      new Date(result.created_at)
    );
  }

  async deleteOrganization(id: string): Promise<void> {
    const { error } = await this._client
      .from("organizations")
      .delete()
      .eq("id", id);

    if (error) {
      throw new InternalError(
        `Failed to delete organization: ${error.message}`
      );
    }
  }

  async addOrganizationMember(
    organizationId: string,
    userId: string,
    role: "owner" | "admin" | "member"
  ): Promise<OrganizationMember> {
    const { data, error } = await this._client
      .from("organization_members")
      .insert({
        organization_id: organizationId,
        user_id: userId,
        role,
      })
      .select()
      .single();

    if (error) {
      throw new InternalError(
        `Failed to add organization member: ${error.message}`
      );
    }

    return new OrganizationMember(
      data.id,
      data.organization_id,
      data.user_id,
      data.role,
      new Date(data.created_at)
    );
  }

  async findOrganizationMember(
    organizationId: string,
    userId: string
  ): Promise<OrganizationMember | null> {
    const { data, error } = await this._client
      .from("organization_members")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new InternalError(
        `Failed to fetch organization member: ${error.message}`
      );
    }

    return new OrganizationMember(
      data.id,
      data.organization_id,
      data.user_id,
      data.role,
      new Date(data.created_at)
    );
  }

  async findOrganizationMembers(
    organizationId: string
  ): Promise<OrganizationMember[]> {
    const { data, error } = await this._client
      .from("organization_members")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new InternalError(
        `Failed to fetch organization members: ${error.message}`
      );
    }

    return data.map(
      (item) =>
        new OrganizationMember(
          item.id,
          item.organization_id,
          item.user_id,
          item.role,
          new Date(item.created_at)
        )
    );
  }

  async updateOrganizationMemberRole(
    organizationId: string,
    userId: string,
    role: "owner" | "admin" | "member"
  ): Promise<OrganizationMember> {
    const { data, error } = await this._client
      .from("organization_members")
      .update({ role })
      .eq("organization_id", organizationId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new InternalError(
        `Failed to update organization member role: ${error.message}`
      );
    }

    return new OrganizationMember(
      data.id,
      data.organization_id,
      data.user_id,
      data.role,
      new Date(data.created_at)
    );
  }

  async removeOrganizationMember(
    organizationId: string,
    userId: string
  ): Promise<void> {
    const { error } = await this._client
      .from("organization_members")
      .delete()
      .eq("organization_id", organizationId)
      .eq("user_id", userId);

    if (error) {
      throw new InternalError(
        `Failed to remove organization member: ${error.message}`
      );
    }
  }
}
