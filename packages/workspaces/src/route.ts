import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Container, getUser } from "@repo/core";
import { isAuthenticated } from "@repo/authentication";
import type { WorkspaceService } from "./service.js";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  organizationIdSchema,
  organizationSlugSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdSchema,
  workspaceSlugSchema,
  addMemberSchema,
  updateMemberRoleSchema,
  memberIdSchema,
} from "./validator.js";

export const routes = new Hono();

routes.use("*", isAuthenticated);

routes.post(
  "/organizations",
  isAuthenticated,
  zValidator("json", createOrganizationSchema),
  async (context) => {
    const user = getUser(context);
    const { name, slug, description } = context.req.valid("json");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const result = await service.createOrganization(user.id, name, slug, description);

    return context.json({
      success: true,
      data: {
        organization: result.organization.toObject(),
        membership: result.member.toObject(),
      },
    });
  }
);

routes.get("/organizations", async (context) => {
  const user = getUser(context);

  const service = Container.resolve<WorkspaceService>("WorkspaceService");
  const organizations = await service.getUserOrganizations(user.id);

  return context.json({
    success: true,
    data: organizations.map((org) => org.toObject()),
  });
});

routes.get(
  "/organizations/:id",
  isAuthenticated,
  zValidator("param", organizationIdSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const organization = await service.getOrganizationById(id, user.id);

    return context.json({
      success: true,
      data: organization.toObject(),
    });
  }
);

routes.get(
  "/organizations/by-slug/:slug",
  isAuthenticated,
  zValidator("param", organizationSlugSchema),
  async (context) => {
    const user = getUser(context);
    const { slug } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const organization = await service.getOrganizationBySlug(slug, user.id);

    return context.json({
      success: true,
      data: organization.toObject(),
    });
  }
);

routes.patch(
  "/organizations/:id",
  isAuthenticated,
  zValidator("param", organizationIdSchema),
  zValidator("json", updateOrganizationSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");
    const data = context.req.valid("json");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const organization = await service.updateOrganization(id, user.id, data);

    return context.json({
      success: true,
      data: organization.toObject(),
    });
  }
);

routes.delete(
  "/organizations/:id",
  isAuthenticated,
  zValidator("param", organizationIdSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    await service.deleteOrganization(id, user.id);

    return context.json({
      success: true,
      message: "Organization deleted successfully",
    });
  }
);

routes.get(
  "/organizations/:id/members",
  isAuthenticated,
  zValidator("param", organizationIdSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const members = await service.getOrganizationMembers(id, user.id);

    return context.json({
      success: true,
      data: members.map((m) => m.toObject()),
    });
  }
);

routes.post(
  "/organizations/:id/members",
  isAuthenticated,
  zValidator("param", organizationIdSchema),
  zValidator("json", addMemberSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");
    const { userId, role } = context.req.valid("json");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const member = await service.addOrganizationMember(id, user.id, userId, role);

    return context.json({
      success: true,
      data: member.toObject(),
    });
  }
);

routes.patch(
  "/organizations/:id/members/:userId",
  isAuthenticated,
  zValidator("param", organizationIdSchema.merge(memberIdSchema)),
  zValidator("json", updateMemberRoleSchema),
  async (context) => {
    const user = getUser(context);
    const { id, userId } = context.req.valid("param");
    const { role } = context.req.valid("json");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const member = await service.updateOrganizationMemberRole(id, user.id, userId, role);

    return context.json({
      success: true,
      data: member.toObject(),
    });
  }
);

routes.delete(
  "/organizations/:id/members/:userId",
  isAuthenticated,
  zValidator("param", organizationIdSchema.merge(memberIdSchema)),
  async (context) => {
    const user = getUser(context);
    const { id, userId } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    await service.removeOrganizationMember(id, user.id, userId);

    return context.json({
      success: true,
      message: "Member removed successfully",
    });
  }
);

routes.get(
  "/organizations/:id/workspaces",
  isAuthenticated,
  zValidator("param", organizationIdSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const workspaces = await service.getOrganizationWorkspaces(id, user.id);

    return context.json({
      success: true,
      data: workspaces.map((ws) => ws.toObject()),
    });
  }
);

routes.post(
  "/workspaces",
  isAuthenticated,
  zValidator("json", createWorkspaceSchema),
  async (context) => {
    const user = getUser(context);
    const { organizationId, name, slug, description, timezone } = context.req.valid("json");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const result = await service.createWorkspace(
      user.id,
      organizationId,
      name,
      slug,
      description,
      timezone
    );

    return context.json({
      success: true,
      data: {
        workspace: result.workspace.toObject(),
        membership: result.member.toObject(),
      },
    });
  }
);

routes.get("/workspaces", async (context) => {
  const user = getUser(context);

  const service = Container.resolve<WorkspaceService>("WorkspaceService");
  const workspaces = await service.getUserWorkspaces(user.id);

  return context.json({
    success: true,
    data: workspaces.map((ws) => ws.toObject()),
  });
});

routes.get(
  "/workspaces/:id",
  isAuthenticated,
  zValidator("param", workspaceIdSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const workspace = await service.getWorkspaceById(id, user.id);

    return context.json({
      success: true,
      data: workspace.toObject(),
    });
  }
);

routes.get(
  "/workspaces/by-slug/:organizationId/:slug",
  zValidator("param", workspaceSlugSchema),
  async (context) => {
    const user = getUser(context);
    const { organizationId, slug } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const workspace = await service.getWorkspaceBySlug(organizationId, slug, user.id);

    return context.json({
      success: true,
      data: workspace.toObject(),
    });
  }
);

routes.patch(
  "/workspaces/:id",
  isAuthenticated,
  zValidator("param", workspaceIdSchema),
  zValidator("json", updateWorkspaceSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");
    const data = context.req.valid("json");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const workspace = await service.updateWorkspace(id, user.id, data);

    return context.json({
      success: true,
      data: workspace.toObject(),
    });
  }
);

routes.delete(
  "/workspaces/:id",
  isAuthenticated,
  zValidator("param", workspaceIdSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    await service.deleteWorkspace(id, user.id);

    return context.json({
      success: true,
      message: "Workspace deleted successfully",
    });
  }
);

routes.get(
  "/workspaces/:id/members",
  isAuthenticated,
  zValidator("param", workspaceIdSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const members = await service.getWorkspaceMembers(id, user.id);

    return context.json({
      success: true,
      data: members.map((m) => m.toObject()),
    });
  }
);

routes.post(
  "/workspaces/:id/members",
  isAuthenticated,
  zValidator("param", workspaceIdSchema),
  zValidator("json", addMemberSchema),
  async (context) => {
    const user = getUser(context);
    const { id } = context.req.valid("param");
    const { userId, role } = context.req.valid("json");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const member = await service.addWorkspaceMember(id, user.id, userId, role);

    return context.json({
      success: true,
      data: member.toObject(),
    });
  }
);

routes.patch(
  "/workspaces/:id/members/:userId",
  isAuthenticated,
  zValidator("param", workspaceIdSchema.merge(memberIdSchema)),
  zValidator("json", updateMemberRoleSchema),
  async (context) => {
    const user = getUser(context);
    const { id, userId } = context.req.valid("param");
    const { role } = context.req.valid("json");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    const member = await service.updateWorkspaceMemberRole(id, user.id, userId, role);

    return context.json({
      success: true,
      data: member.toObject(),
    });
  }
);

routes.delete(
  "/workspaces/:id/members/:userId",
  isAuthenticated,
  zValidator("param", workspaceIdSchema.merge(memberIdSchema)),
  async (context) => {
    const user = getUser(context);
    const { id, userId } = context.req.valid("param");

    const service = Container.resolve<WorkspaceService>("WorkspaceService");
    await service.removeWorkspaceMember(id, user.id, userId);

    return context.json({
      success: true,
      message: "Member removed successfully",
    });
  }
);
