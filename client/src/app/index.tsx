import { View, Text } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/libs/axios'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = () => {
  const {data} = useQuery({
    queryKey: ['health'],
    queryFn: async()=>await api.get('/health').then(res=>res.data)
  })
  return (
    <SafeAreaView className='flex-1 items-center justify-center'>
      <Text>{data?.status}</Text>
    </SafeAreaView>
  )
}

export default HomeScreen