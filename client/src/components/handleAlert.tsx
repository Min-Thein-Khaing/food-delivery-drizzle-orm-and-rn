import { Alert } from "react-native";

type ToastProps = {
  message: string;
  description: string;
};

const useAlert = () => {
  const handleAlert = ({ message, description }: ToastProps) => {
    Alert.alert(message, description);
  };

  return {
    handleAlert,
  };
};

export default useAlert;
