import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/stores/userAuthStore";
import { ActivityIndicator, View } from "react-native";

export default function AuthLayout() {
  const { token, _hasHydrated, user } = useAuthStore();

  // Wait until Zustand has loaded persisted data
  if (!_hasHydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  // User is logged in
  if (token) {
    switch (user?.role) {
      case "CUSTOMER":
        return <Redirect href="/(customer)" />;

      case "RESTAURANT_OWNER":
        return <Redirect href="/(restaurant)/(tabs)" />;

      case "DRIVER":
        return <Redirect href="/(driver)" />;
    }
  }

  // User is not logged in
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#ffffff" },
        animation: "none",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}