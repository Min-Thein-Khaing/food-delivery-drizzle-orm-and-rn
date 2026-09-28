import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing.js";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();
export const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
  config:{
    token: configService.get("UPLOADTHING_SECRET")
  }
});