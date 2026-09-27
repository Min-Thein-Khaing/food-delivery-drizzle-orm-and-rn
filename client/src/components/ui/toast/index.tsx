import { createToastHook } from "@gluestack-ui/core/toast/creator";
import {
  StyleSheet,
  Text,
  View,
  type TextProps,
  type ViewProps,
} from "react-native";

export const useToast = createToastHook(View);

type ToastProps = ViewProps & {
  action?: "error" | "warning" | "success" | "info" | "muted";
  variant?: "solid" | "outline";
};

export function Toast({
  action = "muted",
  variant = "solid",
  style,
  ...props
}: ToastProps) {
  return (
    <View
      accessibilityRole="alert"
      {...props}
      style={[
        styles.toast,
        variant === "outline" && styles.outline,
        action === "error" && styles.error,
        action === "warning" && styles.warning,
        action === "success" && styles.success,
        style,
      ]}
    />
  );
}

export function ToastTitle({ style, ...props }: TextProps) {
  return <Text {...props} style={[styles.title, style]} />;
}

export function ToastDescription({ style, ...props }: TextProps) {
  return <Text {...props} style={[styles.description, style]} />;
}

const styles = StyleSheet.create({
  toast: {
    backgroundColor: "#18181b",
    borderColor: "#3f3f46",
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  outline: {
    backgroundColor: "transparent",
  },
  error: {
    borderColor: "#ef4444",
  },
  warning: {
    borderColor: "#f59e0b",
  },
  success: {
    borderColor: "#22c55e",
  },
  title: {
    color: "#fafafa",
    fontSize: 15,
    fontWeight: "600",
  },
  description: {
    color: "#d4d4d8",
    fontSize: 13,
    marginTop: 4,
  },
});
