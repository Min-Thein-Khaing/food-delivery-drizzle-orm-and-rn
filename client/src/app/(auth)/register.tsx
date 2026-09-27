import RegisterComponent from '@/modules/auth/component/register';
import { SafeAreaView } from 'react-native-safe-area-context';

const Register = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} className="flex-1 bg-white">
      <RegisterComponent />
    </SafeAreaView>
  );
};

export default Register;