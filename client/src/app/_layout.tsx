import "../global.css";
import {
  DefaultTheme,
  Stack,
  ThemeProvider,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  ActivityIndicator,
  Appearance,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useAuthStore } from "@/stores/userAuthStore";

Appearance.setColorScheme?.("light");

SplashScreen.preventAutoHideAsync().catch((error) => {
  console.error("Failed to keep the splash screen visible:", error);
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5, //default is 3 and then country is poor internet connection use 5 time
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    },
  },
});

function AppNavigator() {
  const segments = useSegments();
  const router = useRouter();
  const { user, token, accessToken, _hasHydrated } = useAuthStore();
  const routeGroup = segments[0];
  const requiredRole =
    routeGroup === "(restaurant)"
      ? "RESTAURANT_OWNER"
      : routeGroup === "(customer)"
        ? "CUSTOMER"
        : routeGroup === "(driver)"
          ? "DRIVER"
          : undefined;
  const isPrivateRoute = requiredRole !== undefined;
  const hasAccessToken = Boolean(accessToken || token);

  useEffect(() => {
    if (!isPrivateRoute || !_hasHydrated) return;

    if (!hasAccessToken) {
      router.replace("/(auth)/login");
      return;
    }

    if (user?.role !== requiredRole) {
      switch (user?.role) {
        case "RESTAURANT_OWNER":
          router.replace("/(restaurant)/(tabs)");
          break;
        case "CUSTOMER":
          router.replace("/(customer)");
          break;
        case "DRIVER":
          router.replace("/(driver)");
          break;
        default:
          router.replace("/(auth)/login");
      }
    }
  }, [
    _hasHydrated,
    hasAccessToken,
    isPrivateRoute,
    requiredRole,
    router,
    user?.role,
  ]);

  const shouldWaitForAuth = isPrivateRoute && !_hasHydrated;

  return (
    <>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#ffffff" },
          // animation: "none",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(driver)" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(restaurant)" />
      </Stack>
      {shouldWaitForAuth && (
        <View style={styles.authLoadingOverlay}>
          <ActivityIndicator size="large" color="#16845C" />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  authLoadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
});


export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync().catch((error) => {
      console.error("Failed to hide the splash screen:", error);
    });
  }, []);

  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DefaultTheme}>
          <AppNavigator />
        </ThemeProvider>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
