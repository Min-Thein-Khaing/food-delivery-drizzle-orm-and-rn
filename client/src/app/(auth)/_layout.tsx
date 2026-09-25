import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/stores/userAuthStore';

export default function AuthLayout() {
  const { token } = useAuthStore();

  if (token) {
    return <Redirect href="/(tab)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}