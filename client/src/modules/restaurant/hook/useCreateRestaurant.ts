import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { api } from "@/libs/axios";
import type {
  CreateRestaurantPayload,
  Restaurant,
} from "@/types/restaurant";

export default function useCreateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRestaurantPayload) => {
      const response = await api.post<Restaurant>("/restaurant", payload);
      return response.data;
    },
    onSuccess: (restaurant) => {
      queryClient.setQueryData(["restaurant"], restaurant);
      router.replace("/(restaurant)/(tabs)");
    },
  });
}
