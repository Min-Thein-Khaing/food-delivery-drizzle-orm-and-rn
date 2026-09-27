import { useAuthStore } from "@/stores/userAuthStore";
import { Redirect, Stack } from "expo-router";

export default function CustomerLayout() {
    const { user } = useAuthStore();
    if (user?.role !== "CUSTOMER") {
        return <Redirect href="/(auth)/login" />;
    }
    return (
        <Stack screenOptions={{ headerShown:false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}