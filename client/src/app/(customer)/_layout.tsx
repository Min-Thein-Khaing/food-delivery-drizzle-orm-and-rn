import AppTabs from "@/components/app-tabs";
import { useAuthStore } from "@/stores/userAuthStore";
import { Redirect, Stack } from "expo-router";
import { ChartPie, ClipboardList, ClipboardListIcon, House, Menu, Search, ShoppingCart, User } from "lucide-react-native";

export default function CustomerLayout() {
    const { user } = useAuthStore();
    if (user?.role !== "CUSTOMER") {
        return <Redirect href="/(auth)/login" />;
    }
    return (
        <AppTabs tabs={[
            {
                name: "index",
                title: "Home",
                icon: House,
            },
            {   
                name: "search",
                title: "Search",
                icon: Search,
            },
            {
                name: "cart",
                title: "Cart",
                icon: ShoppingCart,
            },
            {
                name: "order",
                title: "Order",
                icon: ClipboardListIcon,
            },
            {
                name: "profile",
                title: "Profile",
                icon: User,
            },
        ]} />
    );
}