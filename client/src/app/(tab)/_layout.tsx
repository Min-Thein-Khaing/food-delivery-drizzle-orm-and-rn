import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppTabs from '@/components/app-tabs'

const _layout = () => {
  return (
    <SafeAreaView>
      <AppTabs />
    </SafeAreaView>
  )
}

export default _layout