import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/stores/userAuthStore'

const Index = () => {
  const router = useRouter()
  const { clearAuth } = useAuthStore()

  const onSubmit = () => {
    clearAuth();
    router.replace('/(auth)/login');
  }
  return (
    <SafeAreaView>
      <Text>Customer Dashboard</Text>
      <Pressable onPress={onSubmit}>
        <Text>Logout</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Index