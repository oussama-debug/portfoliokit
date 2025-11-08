import type { Hono } from "hono";
import type { Container } from "./container.js";
import { InternalError } from "@/error.js";

export interface Module {
  name: string;
  register(container: typeof Container): void | Promise<void>;
  routes(): Hono;
}

export class ModuleRegistry {
  private static _modules = new Map<string, Module>();

  static register(module: Module): void {
    if (this._modules.has(module.name)) {
      throw new InternalError(`Module "${module.name}" is already registered`);
    }
    this._modules.set(module.name, module);
  }

  static get(name: string): Module | undefined {
    return this._modules.get(name);
  }

  static getAll(): Module[] {
    return Array.from(this._modules.values());
  }

  static has(name: string): boolean {
    return this._modules.has(name);
  }
}
