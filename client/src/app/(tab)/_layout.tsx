
import { Redirect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppTabs from '@/components/app-tabs'
import { useAuthStore } from '@/stores/userAuthStore'

const TabLayout = () => {
  const { token } = useAuthStore()

  if (!token) {
    return <Redirect href="/(auth)/login" />
  }

  return (
    <SafeAreaView className="flex-1">
      <AppTabs />
    </SafeAreaView>
  )
}

export default TabLayout