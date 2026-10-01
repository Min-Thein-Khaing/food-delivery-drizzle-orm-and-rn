import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  CheckCircle,
  CircleAlert,
  MapPin,
  Save,
  Store,
  Upload,
  Utensils,
} from "lucide-react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/libs/axios";
import { useUploadThing } from "@/libs/uploading";
import { useAuthStore } from "@/stores/userAuthStore";
import useUpdateRestaurant from "@/modules/restaurant/hook/useUpdateRestaurant";
import {
  createRestaurantSchema,
  type CreateRestaurantFormValues,
  type Restaurant,
  type UpdateRestaurantPayload,
} from "@/types/restaurant";

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

  return "Could not update your restaurant. Check your connection and try again.";
}

const UpdateRestaurant = () => {
  const updateRestaurant = useUpdateRestaurant();
  const token = useAuthStore((state) => state.token);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const hasLoadedValues = useRef(false);

  // Fetch current restaurant data (with staleTime so background refetch doesn't overwrite inputs)
  const {
    data: restaurant,
    isLoading: isFetchingRestaurant,
    isError: isFetchError,
    error: fetchError,
    refetch,
  } = useQuery<Restaurant>({
    queryKey: ["restaurant"],
    queryFn: () => api.get("/restaurant/mine").then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
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

  // Populate form values ONCE when restaurant data is initially loaded
  useEffect(() => {
    if (restaurant && !hasLoadedValues.current) {
      hasLoadedValues.current = true;
      reset({
        name: restaurant.name || "",
        cuisineType: restaurant.cuisineType || "",
        description: restaurant.description || "",
        address: restaurant.address || "",
        imageUrl: restaurant.imageUrl || "",
      });
    }
  }, [restaurant, reset]);

  const currentImageUrl = useWatch({ control, name: "imageUrl" });

  const { startUpload, isUploading } = useUploadThing("restaurantImage", {
    onUploadError: (error) => {
      setUploadError(error.message || "Image upload failed. Please try again.");
    },
    onClientUploadComplete: (files) => {
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

      const realSize = asset.fileSize || blob.size;
      if (realSize && realSize > 0) {
        Object.defineProperty(file, "size", {
          value: realSize,
          writable: false,
          configurable: true,
        });
      }

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
    if (!restaurant?.id) return;

    const payload: UpdateRestaurantPayload = {
      name: data.name.trim(),
      cuisineType: data.cuisineType.trim(),
      description: data.description.trim(),
      address: data.address.trim(),
      ...(data.imageUrl?.trim()
        ? { imageUrl: data.imageUrl.trim() }
        : {}),
    };

    try {
      await updateRestaurant.mutateAsync({ id: restaurant.id, payload });
    } catch (err) {
      const errMsg = getErrorMessage(err);
      Alert.alert("Update Failed", errMsg);
    }
  };

  const isSubmitting =
    isFormSubmitting || updateRestaurant.isPending || isUploading;

  if (isFetchingRestaurant && !restaurant) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        <ActivityIndicator size="large" color="#16845C" />
        <Text style={styles.loadingText}>
          Loading restaurant details...
        </Text>
      </SafeAreaView>
    );
  }

  if (isFetchError && !restaurant) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top"]}>
        <View style={styles.errorIconBox}>
          <CircleAlert color="#E11D48" size={26} />
        </View>
        <Text style={styles.errorTitle}>
          Couldn’t load restaurant
        </Text>
        <Text style={styles.errorSubtitle}>
          {getErrorMessage(fetchError)}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => refetch()}
          style={styles.retryBtn}
        >
          <Text style={styles.retryBtnText}>Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.rootContainer}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mb-6 flex-row items-center">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                onPress={() => router.back()}
                className="mr-4 h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white active:bg-gray-100"
              >
                <ArrowLeft size={20} color="#17232D" />
              </Pressable>

              <View>
                <Text className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Restaurant Settings
                </Text>
                <Text className="mt-0.5 text-2xl font-bold text-gray-900">
                  Update restaurant
                </Text>
              </View>
            </View>

            {/* Banner card */}
            <View className="mb-6 rounded-2xl bg-emerald-950 p-5">
              <View className="mb-3 h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Store size={22} color="#D8F4E7" />
              </View>

              <Text className="text-lg font-bold text-white">
                Edit restaurant information
              </Text>

              <Text className="mt-1 text-sm leading-5 text-emerald-50/90">
                Keep your profile updated so customers have accurate information about your food and location.
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
                  Modify the fields below and save your changes
                </Text>
              </View>
            </View>

            {/* Restaurant image upload */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Restaurant cover photo
              </Text>

              {currentImageUrl ? (
                <View className="mb-3 overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    source={{ uri: currentImageUrl }}
                    className="h-44 w-full"
                    resizeMode="cover"
                  />
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={chooseImage}
                disabled={isUploading}
                className="flex-row items-center justify-center rounded-xl border border-dashed border-emerald-600 bg-emerald-50/50 p-4 active:bg-emerald-100/50"
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#16845C" />
                ) : (
                  <>
                    <Upload size={18} color="#16845C" />
                    <Text className="ml-2 font-medium text-emerald-700">
                      {currentImageUrl ? "Change cover image" : "Upload new image"}
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
                Restaurant name (min 2 characters)
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
                Cuisine type (min 2 characters)
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
                Description (min 10 characters)
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
                    placeholder="Tell customers what makes your restaurant special (at least 10 chars)"
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
                Restaurant address (min 5 characters)
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
            <View className="mb-6 flex-row items-start rounded-xl bg-gray-50 p-3.5">
              <MapPin size={17} color="#64748B" />
              <Text className="ml-2.5 flex-1 text-xs leading-5 text-gray-500">
                This address is visible to customers and drivers for pickups and deliveries.
              </Text>
            </View>

            {/* Submit Button */}
            <Pressable
              className={`mt-2 h-14 flex-row items-center justify-center rounded-xl active:opacity-90 ${
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
                <Save size={18} color="#FFFFFF" />
              )}

              <Text className="ml-2 text-base font-semibold text-white">
                {isSubmitting
                  ? isUploading
                    ? "Uploading image..."
                    : "Saving changes..."
                  : "Save changes"}
              </Text>
            </Pressable>

            {updateRestaurant.isError && (
              <Text className="mt-3 text-center text-sm text-red-600">
                {getErrorMessage(updateRestaurant.error)}
              </Text>
            )}

            {updateRestaurant.isSuccess && (
              <View className="mt-3 flex-row items-center justify-center">
                <CheckCircle size={16} color="#16845C" />
                <Text className="ml-1.5 text-sm font-semibold text-emerald-700">
                  Restaurant updated successfully!
                </Text>
              </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorIconBox: {
    marginBottom: 16,
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#FFF1F2",
  },
  errorTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  errorSubtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  retryBtn: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: "#047857",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default UpdateRestaurant;