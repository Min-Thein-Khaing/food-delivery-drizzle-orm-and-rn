import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import { useEffect, type ReactNode } from "react";
import { Appearance, type ColorSchemeName, View, type ViewProps } from "react-native";

export type ModeType = "light" | "dark" | "system";

type GluestackUIProviderProps = {
  children: ReactNode;
  mode?: ModeType;
  style?: ViewProps["style"];
};

export function GluestackUIProvider({
  children,
  mode = "system",
  style,
}: GluestackUIProviderProps) {
  useEffect(() => {
    if (mode !== "system" && Appearance.getColorScheme() !== mode) {
      Appearance.setColorScheme(mode as ColorSchemeName);
    }
  }, [mode]);

  return (
    <View style={[{ flex: 1, height: "100%", width: "100%" }, style]}>
      <OverlayProvider>
        <ToastProvider>{children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
