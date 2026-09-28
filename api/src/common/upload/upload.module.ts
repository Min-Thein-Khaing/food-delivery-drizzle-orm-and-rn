import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {  uploadthingHandler } from './upload.controller.js';

@Module({})
export class UploadModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(uploadthingHandler).forRoutes("/api/upload");
  }

}
