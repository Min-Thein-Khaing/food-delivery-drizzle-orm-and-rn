import "dotenv/config";
import type { Request } from "express";
import { createUploadthing, type FileRouter } from "uploadthing/express";
import { JwtService } from "@nestjs/jwt";

const f = createUploadthing();
const jwtService = new JwtService();

export const uploadRouter: FileRouter = {
  restaurantImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Missing or invalid authorization token");
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwtService.verify(token, {
          secret: process.env.JWT_SECRET || "pleasewriteasecuresecretkeyhere",
        });

        return { user: decoded };
      } catch (error) {
        throw new Error("Invalid or expired token");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload completed by:", metadata.user);
      console.log("File URL:", file.url);

      return {
        url: file.url,
        ufsUrl: (file as any).ufsUrl || file.url,
        uploadedBy: metadata.user,
      };
    }),

  menuItemImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Missing or invalid authorization token");
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwtService.verify(token, {
          secret: process.env.JWT_SECRET || "pleasewriteasecuresecretkeyhere",
        });

        return { user: decoded };
      } catch (error) {
        throw new Error("Invalid or expired token");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload completed by:", metadata.user);
      console.log("File URL:", file.url);

      return {
        url: file.url,
        ufsUrl: (file as any).ufsUrl || file.url,
        uploadedBy: metadata.user,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;