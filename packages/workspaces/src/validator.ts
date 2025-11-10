import { z } from "zod";

// Organization validators
export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(1000).nullable().optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().max(1000).nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
});

export const organizationIdSchema = z.object({
  id: z.string().uuid("Invalid organization ID"),
});

export const organizationSlugSchema = z.object({
  slug: z.string().min(1),
});

// Workspace validators
export const createWorkspaceSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(1000).nullable().optional(),
  timezone: z.string().max(100).optional().default("UTC"),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().max(1000).nullable().optional(),
  timezone: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});

export const workspaceIdSchema = z.object({
  id: z.string().uuid("Invalid workspace ID"),
});

export const workspaceSlugSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  slug: z.string().min(1),
});

// Member validators
export const addMemberSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum(["admin", "member"]).default("member"),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["owner", "admin", "member"]),
});

export const memberIdSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});
