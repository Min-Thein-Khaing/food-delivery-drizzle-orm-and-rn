import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  type ImageSourcePropType,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";

type AdScreenProps = {
  onFinish: () => void;
  imageSource?: ImageSourcePropType;
  duration?: number;
};

export default function AdScreen({
  onFinish,
  imageSource,
  duration = 5,
}: AdScreenProps) {
  const [countdown, setCountdown] = useState(duration);
  // eslint-disable-next-line react-hooks/refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const hasFinished = useRef(false);

  const handleFinish = () => {
    if (!hasFinished.current) {
      hasFinished.current = true;
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Background Ad Image or Modern Promotion Card */}
      {imageSource ? (
        <Image
          source={imageSource}
          className="absolute w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <View className="flex-1 bg-slate-900 justify-between items-center px-6 py-20">
          <View className="w-full items-center mt-12">
            <View className="bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full mb-4">
              <Text className="text-emerald-400 text-xs font-bold tracking-widest uppercase">
                Sponsored Promotion
              </Text>
            </View>
            <Text className="text-white text-3xl font-extrabold text-center leading-tight">
              Delicious Food Delivered Fast 🚀
            </Text>
            <Text className="text-slate-300 text-sm text-center mt-3 px-4">
              Enjoy up to 30% off your first orders from top-rated restaurants near you!
            </Text>
          </View>

          <View className="w-full bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 items-center">
            <Text className="text-amber-400 font-bold text-lg mb-1">
              🎉 WELCOME PROMO: FOOD30
            </Text>
            <Text className="text-slate-400 text-xs text-center">
              Auto applied on your first checkout
            </Text>
          </View>
        </View>
      )}

      {/* Top Controls Overlay */}
      <View className="absolute top-4 left-0 right-0 z-20">
        <View className="flex-row justify-between items-center px-5 pt-2">
          {/* Ad Label */}
          <View className="bg-black/40 border border-white/20 px-2.5 py-1 rounded-md">
            <Text className="text-white/80 text-[10px] font-semibold tracking-wider uppercase">
              Ad
            </Text>
          </View>

          {/* Countdown & Skip Action */}
          <View className="flex-row items-center space-x-2">
            {countdown > 0 && (
              <View className="w-8 h-8 rounded-full bg-black/50 border border-white/20 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {countdown}
                </Text>
              </View>
            )}

            <Pressable
              onPress={handleFinish}
              className="bg-black/60 border border-white/30 px-4 py-1.5 rounded-full active:opacity-75 active:bg-black/80"
            >
              <Text className="text-white text-xs font-semibold">
                {countdown === 0 ? "Continue ›" : "Skip ›"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
