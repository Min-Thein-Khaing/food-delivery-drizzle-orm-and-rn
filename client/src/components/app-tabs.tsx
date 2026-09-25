import React from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Home, Compass, UserRound } from 'lucide-react-native';

export default function AppTabs() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const activeColor = isDark ? '#38bdf8' : '#0284c7';
  const inactiveColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: isDark
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.65)',
          backgroundColor: isDark
            ? 'rgba(20, 20, 25, 0.65)'
            : 'rgba(255, 255, 255, 0.72)',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowRadius: 18,
          overflow: 'hidden',
          paddingBottom: Platform.OS === 'ios' ? 8 : 6,
          paddingTop: 6,
          marginBottom: Platform.OS === 'ios' ? 16 : 0,
          marginHorizontal: 9,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === 'ios' ? 80 : 95}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Home
              size={size || 22}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size, focused }) => (
            <Compass
              size={size || 22}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="(auth)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <UserRound
              size={size || 22}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}
