import { Module } from '@nestjs/common';
import { MenuService } from './providers/menu.service.js';

@Module({
  providers: [MenuService]
})
export class MenuModule {}
