export abstract class BaseService {
  protected readonly serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  protected log(message: string, data?: any): void {
    console.log(`[${this.serviceName}] ${message}`, data || "");
  }

  protected logError(message: string, error?: any): void {
    console.error(`[${this.serviceName}] ${message}`, error || "");
  }
}
