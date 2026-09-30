import AppTabs from "@/components/app-tabs";
import {
  ChartNoAxesCombined,
  ClipboardList,
  Menu,
  User,
} from "lucide-react-native";

export default function RestaurantTabsLayout() {
  return (
    <AppTabs
      tabs={[
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
      ]}
    />
  );
}
