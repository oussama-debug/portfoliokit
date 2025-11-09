import { InternalError } from "@/error.js";

export class Container {
  private static _services = new Map<string, any>();
  private static _factories = new Map<string, () => any>();

  static register<T>(key: string, factory: () => T): void {
    this._factories.set(key, factory);
  }

  static registerSingleton<T>(key: string, instance: T): void {
    this._services.set(key, instance);
  }

  static resolve<T>(key: string): T {
    if (this._services.has(key)) {
      return this._services.get(key) as T;
    }

    const factory = this._factories.get(key);
    if (!factory) {
      throw new InternalError(`Service "${key}" not registered in container`);
    }

    const instance = factory();
    this._services.set(key, instance);
    return instance as T;
  }

  static has(key: string): boolean {
    return this._services.has(key) || this._factories.has(key);
  }

  static clear(): void {
    this._services.clear();
    this._factories.clear();
  }
}
