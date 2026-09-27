import { useAuthStore } from "@/stores/userAuthStore";
import { Redirect, Stack } from "expo-router";

export default function RestaurantLayout() {
    const { user } = useAuthStore();
    if (user?.role !== "RESTAURANT_OWNER") {
        return <Redirect href="/(auth)/login" />;
    }
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}