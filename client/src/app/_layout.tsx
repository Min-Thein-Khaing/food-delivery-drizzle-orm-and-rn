import "../global.css";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Appearance, useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

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
        </ThemeProvider>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
