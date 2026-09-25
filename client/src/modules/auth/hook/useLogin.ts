import { login } from "@/services/auth";
import { loginSchema, LoginSchemaType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const useLogin = () => {
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
      return await login(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  return { control, handleSubmit, errors, isSubmitting, onSubmit };
};
export default useLogin;
