import "dotenv/config";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing.js";

export const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
  config: {
    token:
      process.env.UPLOADTHING_TOKEN ||
      process.env.UPLOADTHING_SECRET ||
      undefined,
  },
});