import { useState } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/stores/userAuthStore";
import { ActivityIndicator, View } from "react-native";
import AdScreen from "@/modules/ad/AdScreen";

export default function IndexRoute() {
  const { token, _hasHydrated, user } = useAuthStore();
  const [adDone, setAdDone] = useState(false);

  // Show the ad while waiting — hydration happens in the background during this time
  if (!adDone) {
    return <AdScreen onFinish={() => setAdDone(true)} />;
  }

  // Still hydrating after ad finished — show white loading screen
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

  // Hydrated — redirect based on role (white bg prevents black flash)
  if (token && user?.role === "CUSTOMER") {
    return <Redirect href="/(customer)" />;
  }
  if (token && user?.role === "RESTAURANT_OWNER") {
    return <Redirect href="/(restaurant)/(tabs)" />;
  }
  if (token && user?.role === "DRIVER") {
    return <Redirect href="/(driver)" />;
  }
  return <Redirect href="/(auth)/login" />;
}