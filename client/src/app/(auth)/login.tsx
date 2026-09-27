import LoginComponent from "@/modules/auth/component/login";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} className="flex-1 bg-white">
      <LoginComponent />
    </SafeAreaView>
  );
}
