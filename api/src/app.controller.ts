import { Controller, Get, Inject } from '@nestjs/common';
import type { HealthCheckResponse } from './types/index.js';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { schema } from './db/index.js';

@Controller()
export class AppController {
  constructor(@Inject('DB') private readonly db: NeonHttpDatabase) {}

  @Get('/db-test')
  public async dbTest() {
    const result = await this.db.select().from(schema.user);
    return { users: result, count: result.length };
  }

  @Get('/health')
  public healthCheck(): HealthCheckResponse {
    return {
      status: 'san kyi tar par ',
      timeStamp: new Date(),
    };
  }
}
