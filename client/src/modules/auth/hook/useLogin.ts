import useAppToast from "@/components/handleToast";
import { login } from "@/services/auth";
import { loginSchema, LoginSchemaType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const useLogin = () => {
  const { handleToast } = useAppToast();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const response = await login(data.email, data.password);
      handleToast({
        message: "Login successful",
        description: "You have successfully logged in",
      })

      return response
    } catch (error) {
      handleToast({
        message: "Login failed",
        description: "Invalid email or password",
      })
      throw error;
    }
  };
  return { control, handleSubmit, errors, isSubmitting, onSubmit };
};
export default useLogin;
