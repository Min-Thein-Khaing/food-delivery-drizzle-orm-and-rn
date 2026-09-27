import { api } from "@/libs/axios";
import { useAuthStore, type User } from "@/stores/userAuthStore";
import { Register } from "@/types/auth";

type AuthResponse = {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
};

export const login = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  useAuthStore.getState().setAuth(response.data);
  return response.data;
};

export const register = async (data: Register) => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  useAuthStore.getState().setAuth(response.data);
  return response.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
  useAuthStore.getState().clearAuth();
};
