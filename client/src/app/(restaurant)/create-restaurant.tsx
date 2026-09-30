import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  ImagePlus,
  MapPin,
  Store,
  Utensils,
  Upload,
} from "lucide-react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCreateRestaurant from "@/modules/restaurant/hook/useCreateRestaurant";

import {
  createRestaurantSchema,
  type CreateRestaurantFormValues,
  type CreateRestaurantPayload,
} from "@/types/restaurant";
import { useUploadThing } from "@/libs/uploading";
import { useAuthStore } from "@/stores/userAuthStore";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: unknown }).response;

    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = (response as { data?: unknown }).data;

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data
      ) {
        const message = (data as { message?: unknown }).message;

        if (typeof message === "string") {
          return message;
        }

        if (Array.isArray(message)) {
          return message.join(", ");
        }
      }
    }
  }

  return "Could not create your restaurant. Check your connection and try again.";
}

const CreateRestaurant = () => {
  const createRestaurant = useCreateRestaurant();
  const token = useAuthStore((state) => state.token);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<CreateRestaurantFormValues>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: {
      name: "",
      cuisineType: "",
      description: "",
      address: "",
      imageUrl: "",
    },
  });

  const currentImageUrl = useWatch({ control, name: "imageUrl" });

  const { startUpload, isUploading } = useUploadThing("restaurantImage", {
    headers: async () => {
      const currentToken = useAuthStore.getState().token;
      return currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
    },
    onUploadError: (error) => {
      setUploadError(error.message || "Image upload failed. Please try again.");
    },
    onClientUploadComplete: (files) => {
      // Check for ufsUrl, url, or fileUrl depending on uploadthing SDK version
      const file = files?.[0] as Record<string, any> | undefined;
      const uploadedUrl =
        file?.ufsUrl ||
        file?.url ||
        file?.fileUrl ||
        file?.serverData?.ufsUrl ||
        file?.serverData?.url;

      if (uploadedUrl) {
        setValue("imageUrl", uploadedUrl, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setUploadError(null);
      } else {
        setUploadError("Upload finished, but no image URL was returned.");
      }
    },
  });

  const chooseImage = async () => {
    setUploadError(null);

    const currentToken = useAuthStore.getState().token;
    if (!currentToken) {
      setUploadError("Please sign in again before uploading an image.");
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setUploadError("Allow photo library access to choose an image.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      const asset = result.assets[0];
      const blob = await fetch(asset.uri).then((r) => r.blob());
      const fileName =
        asset.fileName || asset.uri.split("/").pop() || "restaurant.jpg";
      const mimeType = asset.mimeType || "image/jpeg";

      const file = new File([blob], fileName, { type: mimeType });

      // In React Native, blob.size is often incorrect (e.g. 14 bytes).
      // Overriding size with the actual asset.fileSize ensures UploadThing
      // signs presigned URLs with the correct size, preventing XHR 413 error.
      const realSize = asset.fileSize || blob.size;
      if (realSize && realSize > 0) {
        Object.defineProperty(file, "size", {
          value: realSize,
          writable: false,
          configurable: true,
        });
      }

      // Required by React Native FormData native bridge
      Object.assign(file, { uri: asset.uri });

      await startUpload([file]);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Could not upload the image. Please try again."
      );
    }
  };


  const submitForm = async (
    data: CreateRestaurantFormValues
  ): Promise<void> => {
    const payload: CreateRestaurantPayload = {
      name: data.name,
      cuisineType: data.cuisineType,
      description: data.description,
      address: data.address,
      ...(data.imageUrl?.trim()
        ? { imageUrl: data.imageUrl.trim() }
        : {}),
    };

    await createRestaurant.mutateAsync(payload).catch(() => undefined);
  };

  const isSubmitting =
    isFormSubmitting || createRestaurant.isPending || isUploading;

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            style={{ flex: 1 }}
            contentContainerClassName="flex-grow px-6 py-8"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingVertical: 32,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mb-6 flex-row items-center">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                onPress={() => router.back()}
                className="mr-4 h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white"
              >
                <ArrowLeft size={20} color="#17232D" />
              </Pressable>

              <View>
                <Text className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Restaurant setup
                </Text>

                <Text className="mt-1 text-2xl font-bold text-gray-900">
                  Create restaurant
                </Text>
              </View>
            </View>

            {/* Intro */}
            <View className="mb-7 rounded-2xl bg-emerald-950 p-5">
              <View className="mb-3 h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Store size={22} color="#D8F4E7" />
              </View>

              <Text className="text-lg font-bold text-white">
                Set up your restaurant
              </Text>

              <Text className="mt-1 text-sm leading-5 text-emerald-50">
                Add these details so customers can find your restaurant.
              </Text>
            </View>

            {/* Section title */}
            <View className="mb-5 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Utensils size={19} color="#16845C" />
              </View>

              <View>
                <Text className="text-base font-bold text-gray-900">
                  Restaurant details
                </Text>

                <Text className="mt-0.5 text-xs text-gray-500">
                  Complete the required fields
                </Text>
              </View>
            </View>

            {/* Restaurant image upload */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Restaurant image (optional)
              </Text>

              {currentImageUrl ? (
                <View className="mb-3 overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    source={{ uri: currentImageUrl }}
                    className="h-40 w-full"
                    resizeMode="cover"
                  />
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={chooseImage}
                disabled={isUploading}
                className="flex-row items-center justify-center rounded-xl border border-dashed border-emerald-600 bg-emerald-50/50 p-4"
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#16845C" />
                ) : (
                  <>
                    <Upload size={18} color="#16845C" />
                    <Text className="ml-2 font-medium text-emerald-700">
                      {currentImageUrl ? "Change image" : "Choose and upload image"}
                    </Text>
                  </>
                )}
              </Pressable>

              {uploadError ? (
                <Text className="mt-2 text-sm text-red-600">
                  {uploadError}
                </Text>
              ) : null}

              {errors.imageUrl && (
                <Text className="mt-2 text-sm text-red-500">
                  {errors.imageUrl.message}
                </Text>
              )}
            </View>

            {/* Restaurant name */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Restaurant name
              </Text>

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-14 rounded-xl border px-4 text-base text-gray-900 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g. Burger Palace"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                  />
                )}
              />

              {errors.name && (
                <Text className="mt-2 text-sm text-red-500">
                  {errors.name.message}
                </Text>
              )}
            </View>

            {/* Cuisine type */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Cuisine type
              </Text>

              <Controller
                control={control}
                name="cuisineType"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-14 rounded-xl border px-4 text-base text-gray-900 ${
                      errors.cuisineType
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g. Burmese, Italian, American"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                  />
                )}
              />

              {errors.cuisineType && (
                <Text className="mt-2 text-sm text-red-500">
                  {errors.cuisineType.message}
                </Text>
              )}
            </View>

            {/* Description */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Description
              </Text>

              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`min-h-32 rounded-xl border px-4 py-3 text-base text-gray-900 ${
                      errors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Tell customers what makes your restaurant special"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    textAlignVertical="top"
                    autoCapitalize="sentences"
                  />
                )}
              />

              {errors.description && (
                <Text className="mt-2 text-sm text-red-500">
                  {errors.description.message}
                </Text>
              )}
            </View>

            {/* Address */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Restaurant address
              </Text>

              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-14 rounded-xl border px-4 text-base text-gray-900 ${
                      errors.address
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Street, township, city"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                  />
                )}
              />

              {errors.address && (
                <Text className="mt-2 text-sm text-red-500">
                  {errors.address.message}
                </Text>
              )}
            </View>

            {/* Address note */}
            <View className="mb-5 flex-row items-start rounded-xl bg-gray-50 p-3.5">
              <MapPin size={17} color="#64748B" />

              <Text className="ml-2.5 flex-1 text-xs leading-5 text-gray-500">
                Use the address customers should visit or use for delivery.
              </Text>
            </View>

            {/* Submit */}
            <Pressable
              className={`mt-2 h-14 flex-row items-center justify-center rounded-xl ${
                isSubmitting
                  ? "bg-emerald-400"
                  : "bg-emerald-700"
              }`}
              onPress={handleSubmit(submitForm)}
              disabled={isSubmitting}
              accessibilityRole="button"
            >
              {isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <ImagePlus size={18} color="#FFFFFF" />
              )}

              <Text className="ml-2 text-base font-semibold text-white">
                {isSubmitting
                  ? isUploading
                    ? "Uploading image..."
                    : "Creating..."
                  : "Create restaurant"}
              </Text>
            </Pressable>

            {createRestaurant.isError && (
              <Text className="mt-3 text-center text-sm text-red-600">
                {getErrorMessage(createRestaurant.error)}
              </Text>
            )}

            <Text className="mt-6 text-center text-sm text-gray-500">
              You can update these details later from your dashboard.
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateRestaurant;