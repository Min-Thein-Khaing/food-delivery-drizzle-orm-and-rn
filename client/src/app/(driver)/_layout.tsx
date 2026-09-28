import AppTabs from "@/components/app-tabs";
import { useAuthStore } from "@/stores/userAuthStore";
import { Redirect } from "expo-router";
import { House, Bike, History, User } from "lucide-react-native";

export default function DriverLayout() {
  const { user } = useAuthStore();

  if (user?.role !== "DRIVER") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <AppTabs
      tabs={[
        {
          name: "index",
          title: "Home",
          icon: House,
        },
        {
          name: "active",
          title: "Active",
          icon: Bike,
        },
        {
          name: "history",
          title: "History",
          icon: History,
        },
        {
          name: "profile",
          title: "Profile",
          icon: User,
        },
      ]}
    />
  );
}