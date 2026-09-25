import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller } from "react-hook-form";
import useLogin from "../hook/useLogin";
import { router } from "expo-router";

const LoginComponent = () => {
  const { control, handleSubmit, errors, isSubmitting, onSubmit } = useLogin();

  return (
    <View className="flex-1 bg-white justify-center">
      <KeyboardAvoidingView
        className=""
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View className="px-6">

            {/* Header */}
            <View className="mb-8">

              <Text className="text-3xl font-bold text-gray-900">

                Welcome Back
              </Text>
              <Text className="mt-2 text-base text-gray-500">

                Sign in to continue to your account.
              </Text>
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
                    className={`h-14 rounded-xl border px-4 text-base text-gray-900 ${errors.email ? "border-red-500" : "border-gray-300"}`}
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
            <View className="mb-3">

              <View className="mb-2 flex-row items-center justify-between">

                <Text className="text-sm font-medium text-gray-700">

                  Password
                </Text>
                <TouchableOpacity>

                  <Text className="text-sm font-semibold text-blue-600">

                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-14 rounded-xl border px-4 text-base text-gray-900 ${errors.password ? "border-red-500" : "border-gray-300"}`}
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
            {/* Login Button */}
            <TouchableOpacity
              className={`mt-5 h-14 items-center justify-center rounded-xl ${isSubmitting ? "bg-blue-400" : "bg-blue-600"}`}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >

              <Text className="text-base font-semibold text-white">

                {isSubmitting ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>
            {/* Register */}
            <View className="mt-8 flex-row justify-center">

              <Text className="text-base text-gray-500">

                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>

                <Text className="text-base font-semibold text-blue-600">

                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};
export default LoginComponent;
