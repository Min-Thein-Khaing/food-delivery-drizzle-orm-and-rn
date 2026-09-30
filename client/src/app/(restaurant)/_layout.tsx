import { Redirect, Stack, usePathname } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

export default function RestaurantLayout() {
  
  

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="create-restaurant" />
      <Stack.Screen name="update-restaurant" />
    </Stack>
  );
}
