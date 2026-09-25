
import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller } from "react-hook-form";
import useRegister from "../hook/useRegister";
import { router } from "expo-router";

const RegisterComponent = () => {
  const { control, errors,handleSubmit, isSubmitting, onSubmit } = useRegister();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerClassName="flex-grow justify-center px-6 py-8"
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900">
                Create Account
              </Text>

              <Text className="mt-2 text-base text-gray-500">
                Create your account to get started.
              </Text>
            </View>

            {/* First Name */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                First Name
              </Text>

              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-14 rounded-xl border px-4 text-base text-gray-900 ${
                      errors.firstName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your first name"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                  />
                )}
              />

              {errors.firstName && (
                <Text className="mt-2 text-sm text-red-500">
                  {errors.firstName.message}
                </Text>
              )}
            </View>

            {/* Last Name */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Last Name
              </Text>

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-14 rounded-xl border px-4 text-base text-gray-900 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your last name"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                  />
                )}
              />

              {errors.lastName && (
                <Text className="mt-2 text-sm text-red-500">
                  {errors.lastName.message}
                </Text>
              )}
            </View>

            {/* Email */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Email
              </Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-14 rounded-xl border px-4 text-base text-gray-900 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />

              {errors.email && (
                <Text className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Password
              </Text>

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-14 rounded-xl border px-4 text-base text-gray-900 ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />

              {errors.password && (
                <Text className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Role */}
            <View className="mb-6">
              <Text className="mb-3 text-sm font-medium text-gray-700">
                Account Type
              </Text>

              <Controller
                control={control}
                name="role"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row gap-2">
                    {["CUSTOMER", "RESTAURANT_OWNER", "DRIVER"].map(
                      (role) => (
                        <Pressable
                          key={role}
                          onPress={() => onChange(role)}
                          className={`flex-1 rounded-xl border p-3 ${
                            value === role
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          <Text
                            className={`text-center text-xs font-medium ${
                              value === role
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            {role.replace("_", " ")}
                          </Text>
                        </Pressable>
                      ),
                    )}
                  </View>
                )}
              />

              {errors.role && (
                <Text className="mt-2 text-sm text-red-500">
                  {errors.role.message}
                </Text>
              )}
            </View>

            {/* Submit */}
            <Pressable
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              className={`h-14 items-center justify-center rounded-xl ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600"
              }`}
            >
              <Text className="text-base font-semibold text-white">
                {isSubmitting
                  ? "Creating account..."
                  : "Create Account"}
              </Text>
            </Pressable>

            {/* Login */}
            <View className="mt-8 flex-row justify-center">
              <Text className="text-base text-gray-500">
                Already have an account?{" "}
              </Text>

              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text className="font-semibold text-blue-600">
                  Sign In
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterComponent;
