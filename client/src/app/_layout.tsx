import "../global.css";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { useAuthStore } from "@/stores/userAuthStore";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

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
  const { _hasHydrated } = useAuthStore()

  useEffect(() => {
    if (_hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [_hasHydrated]);
  if (!_hasHydrated) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tab)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
