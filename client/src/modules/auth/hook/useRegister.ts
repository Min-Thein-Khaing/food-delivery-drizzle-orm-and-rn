import { registerSchema, RegisterSchemaType } from './../../../types/auth';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from '@/services/auth';
import { useRouter } from 'expo-router';

const useRegister = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      return await register(data);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }finally{
      router.push('/(auth)/login')
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
};
export default useRegister;
