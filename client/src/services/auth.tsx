import { api } from "@/libs/axios";
import { useAuthStore } from "@/stores/userAuthStore";
import { Register } from "@/types/auth";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  useAuthStore.getState().setAuth(response.data);
  return response.data;
};

export const register = async (data: Register) => {
  const response = await api.post("/auth/register", data);
  useAuthStore.getState().setAuth(response.data);
  return response.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
  useAuthStore.getState().clearAuth();
};
