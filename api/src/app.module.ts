import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UploadModule } from './common/upload/upload.module.js';
import { RestaurantModule } from './modules/restaurant/restaurant.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DbModule,
    AuthModule,
    UploadModule,
    RestaurantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
