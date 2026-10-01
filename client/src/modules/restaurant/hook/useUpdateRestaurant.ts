import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { api } from "@/libs/axios";
import type {
  Restaurant,
  UpdateRestaurantPayload,
} from "@/types/restaurant";

export default function useUpdateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateRestaurantPayload;
    }) => {
      const response = await api.patch<Restaurant>(`/restaurant/${id}`, payload);
      return response.data;
    },
    onSuccess: (updatedRestaurant) => {
      // 1. Immediately update the cache so (tabs)/index shows the new data instantly
      queryClient.setQueryData(["restaurant"], updatedRestaurant);
      // 2. Mark stale to ensure consistency with backend
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
      // 3. Navigate back to workspace dashboard
      router.back();
    },
  });
}
