import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller.js';
import { RestaurantService } from './providers/restaurant.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule {}
