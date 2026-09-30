import { generateReactNativeHelpers } from "@uploadthing/expo";

const rawServerUrl =
  process.env.EXPO_PUBLIC_SERVAL_URL ||
  process.env.EXPO_PUBLIC_SERVER_URL ||
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://10.60.167.47:3000";

const baseUrl = rawServerUrl.replace(/\/+$/, "");

export const { useImageUploader, useDocumentUploader, useUploadThing } =
  generateReactNativeHelpers({
    url: `${baseUrl}/api/upload`,
  });


