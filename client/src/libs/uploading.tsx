import { generateReactNativeHelpers } from "@uploadthing/expo";

export const { useImageUploader, useDocumentUploader } =
  generateReactNativeHelpers({
    url: process.env.EXPO_PUBLIC_SERVAL_URL,
  });
