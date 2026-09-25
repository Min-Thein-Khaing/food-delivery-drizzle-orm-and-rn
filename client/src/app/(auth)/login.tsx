import LoginComponent from '@/modules/auth/component/login';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Login = () => {
  return (
    <SafeAreaView className="flex-1">
      <LoginComponent />
    </SafeAreaView>
  );
};

export default Login;