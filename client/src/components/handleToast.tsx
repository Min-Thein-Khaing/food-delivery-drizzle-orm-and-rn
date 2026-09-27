import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { useState } from "react";

type ToastProps = {
  message: string;
  description: string;
};

export default function useAppToast() {
  const toast = useToast();

  const [toastId, setToastId] = useState<string | null>(null);

  const handleToast = ({ message, description }: ToastProps) => {
    // If the current toast is already active,
    // don't create another one.
    if (toastId && toast.isActive(toastId)) {
      return;
    }

    const newToastId = toast.show({
      placement: "top",

      render: ({ id }) => {
        const uniqueToastId = `toast-${id}`;

        return (
          <Toast
            nativeID={uniqueToastId}
            action="muted"
            variant="solid"
          >
            <ToastTitle>{message}</ToastTitle>

            <ToastDescription>
              {description}
            </ToastDescription>
          </Toast>
        );
      },
    });

    setToastId(newToastId);
  };

  return {
    handleToast,
  };
}