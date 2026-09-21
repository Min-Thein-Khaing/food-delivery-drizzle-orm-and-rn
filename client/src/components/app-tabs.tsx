import { DynamicColorIOS, Platform, useColorScheme } from 'react-native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
  const scheme = useColorScheme();

  const tintColor =
    Platform.OS === 'ios'
      ? DynamicColorIOS({
          light: 'black',
          dark: 'white',
        })
      : scheme === 'dark'
        ? 'white'
        : 'black';

  return (
    <NativeTabs
      labelStyle={{ color: tintColor }}
      tintColor={tintColor}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home_filled' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'star', selected: 'star.fill' }}
          md={{ default: 'star_border', selected: 'star' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}