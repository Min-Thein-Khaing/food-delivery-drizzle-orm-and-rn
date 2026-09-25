import RegisterComponent from '@/modules/auth/component/register';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Register = () => {
  return (
    <SafeAreaView className="flex-1 ">
      <RegisterComponent />
    </SafeAreaView>
  );
};

export default Register;