import { Controller, Get } from '@nestjs/common';
import type { HealthCheckResponse } from './types/index.js';

@Controller()
export class AppController {
  @Get('/health')
  public healthCheck(): HealthCheckResponse {
    return {
      status: 'san kyi tar par ',
      timeStamp: new Date(),
    };
  }
}
