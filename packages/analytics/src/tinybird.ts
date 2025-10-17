import { env } from "@repo/env";

export class Tinybird {
  private m_apiDsn: string;
  private m_apiToken: string;

  constructor(
    private readonly _token?: string,
    private readonly _dsn?: string
  ) {
    this.m_apiDsn = env.TINYBIRD_API_DSN || _dsn;
    this.m_apiToken = env.TINYBIRD_API_KEY || _token;
  }
}
