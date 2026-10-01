import { useState } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/stores/userAuthStore";
import { ActivityIndicator, Text, View } from "react-native";
import AdScreen from "@/modules/ad/AdScreen";

export default function IndexRoute() {
  const { token, _hasHydrated, user } = useAuthStore();
  const [adDone, setAdDone] = useState(false);

  // 1. Show Ad while Auth hydration loads in the background
  if (!adDone) {
    return <AdScreen onFinish={() => setAdDone(true)} duration={5} />;
  }

  // 2. Fallback loading state if hydration is still pending (Smooth & Clean UI)
  if (!_hasHydrated) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-xl font-bold text-emerald-600 tracking-wider mb-2">
          FOOD DELIVERY
        </Text>
        <ActivityIndicator size="small" color="#059669" />
      </View>
    );
  }

  // 3. Hydration finished -> Role-based Redirection
  if (token && user?.role === "CUSTOMER") {
    return <Redirect href="/(customer)" />;
  }
  if (token && user?.role === "RESTAURANT_OWNER") {
    return <Redirect href="/(restaurant)/(tabs)" />;
  }
  if (token && user?.role === "DRIVER") {
    return <Redirect href="/(driver)" />;
  }

  // Default to Login screen
  return <Redirect href="/(auth)/login" />;
}