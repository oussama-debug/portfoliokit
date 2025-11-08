import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("module", {
    description: "Generate a new module following SOLID principles",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Module name (e.g., 'users', 'notifications'):",
        validate: (input: string) => {
          if (!input) return "Module name is required";
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return "Module name must be lowercase and contain only letters, numbers, and hyphens";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "entityName",
        message: "Entity name (singular, e.g., 'User', 'Notification'):",
        validate: (input: string) => {
          if (!input) return "Entity name is required";
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return "Entity name must be PascalCase";
          }
          return true;
        },
      },
      {
        type: "confirm",
        name: "requiresAuth",
        message: "Does this module require authentication?",
        default: true,
      },
      {
        type: "input",
        name: "tableName",
        message: "Supabase table name (leave empty to use module name):",
        default: "",
      },
    ],
    actions: (data) => {
      const moduleName = data?.name as string;
      const entityName = data?.entityName as string;
      const tableName = (data?.tableName as string) || moduleName;
      const requiresAuth = data?.requiresAuth as boolean;

      const basePath = `apps/gateway/src/${moduleName}`;

      return [
        {
          type: "add",
          path: `${basePath}/model.ts`,
          templateFile: "templates/module/model.ts.hbs",
          data: { entityName, moduleName },
        },
        {
          type: "add",
          path: `${basePath}/repository.ts`,
          templateFile: "templates/module/repository.ts.hbs",
          data: { entityName, moduleName },
        },
        {
          type: "add",
          path: `${basePath}/repositories/supabase.repository.ts`,
          templateFile: "templates/module/supabase.repository.ts.hbs",
          data: { entityName, moduleName, tableName },
        },
        {
          type: "add",
          path: `${basePath}/service.ts`,
          templateFile: "templates/module/service.ts.hbs",
          data: { entityName, moduleName },
        },
        {
          type: "add",
          path: `${basePath}/validator.ts`,
          templateFile: "templates/module/validator.ts.hbs",
          data: { entityName, moduleName },
        },
        {
          type: "add",
          path: `${basePath}/route.ts`,
          templateFile: "templates/module/route.ts.hbs",
          data: { entityName, moduleName, requiresAuth },
        },
        {
          type: "add",
          path: `${basePath}/module.ts`,
          templateFile: "templates/module/module.ts.hbs",
          data: { entityName, moduleName },
        },
        {
          type: "add",
          path: `${basePath}/index.ts`,
          templateFile: "templates/module/index.ts.hbs",
          data: { entityName, moduleName },
        },
        {
          type: "add",
          path: `${basePath}/.generated`,
          template: "Module generated successfully!",
        },
      ];
    },
  });
}
