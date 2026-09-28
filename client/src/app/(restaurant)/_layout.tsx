import AppTabs from "@/components/app-tabs";
import { useAuthStore } from "@/stores/userAuthStore";
import { Redirect, Stack } from "expo-router";
import { ChartNoAxesCombined, ClipboardList, Menu, User } from "lucide-react-native";

export default function RestaurantLayout() {
    const { user } = useAuthStore();
    if (user?.role !== "RESTAURANT_OWNER") {
        return <Redirect href="/(auth)/login" />;
    }
    return (

        <AppTabs tabs={[
            {
                name: "index",
                title: "Order",
                icon: ClipboardList,
            },
            {
                name: "menu",
                title: "Menu",
                icon: Menu,
            },
            {
                name: "analytics",
                title: "Analytics",
                icon: ChartNoAxesCombined,
            },
            {
                name: "profile",
                title: "Profile",
                icon: User,
            },
        ]} />
    );
}