import { useEffect, useRef, useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AdScreenProps = {
  onFinish: () => void;
  imageSource?: ImageSourcePropType;
};

export default function AdScreen({ onFinish, imageSource }: AdScreenProps) {
  const [countdown, setCountdown] = useState(5);
  const hasFinished = useRef(false);

  const handleFinish = () => {
    if (!hasFinished.current) {
      hasFinished.current = true;
      onFinish();
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

    // Auto-advance after countdown ends (5 seconds)
    const finishTimer = setTimeout(() => {
      handleFinish();
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>Advertisement</Text>
        </View>
      )}

      {countdown > 0 ? (
        <View style={styles.countdown}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      ) : (
        <Pressable onPress={handleFinish} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },

  fallbackText: {
    color: "#374151",
    fontSize: 18,
    fontWeight: "600",
  },

  countdown: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  countdownText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  skipText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
