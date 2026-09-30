import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  MapPin,
  Plus,
  Power,
  Star,
  Store,
  UtensilsCrossed,
} from "lucide-react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/axios";
import { useAuthStore } from "@/stores/userAuthStore";


function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response;
    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = response.data;
      if (typeof data === "object" && data !== null && "message" in data) {
        const message = data.message;
        if (typeof message === "string") return message;
        if (Array.isArray(message)) return message.join(", ");
      }
    }
  }
  return "Please check your connection and try again.";
}

export default function RestaurantOwnerIndex() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  

  const { data: restaurant, isLoading, isError, error,refetch } = useQuery({
    queryKey: ["restaurant"],
    queryFn: () => api.get(`/restaurant/mine`).then((res) => res.data),
  })
  const toggleMutation = useMutation({
    mutationFn: () => {
      return api.patch(`/restaurant/${restaurant.id}`, {
        isOpen: !restaurant.isOpen,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["restaurant"] }),
  });

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-slate-50"
      >
        <ActivityIndicator size="large" color="#16845C" />
        <Text className="mt-3.5 text-sm text-slate-500">
          Preparing your restaurant...
        </Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-slate-50 px-7"
        edges={["top"]}
      >
        <View className="mb-4 h-[54px] w-[54px] items-center justify-center rounded-[18px] bg-rose-50">
          <CircleAlert color="#C84B4B" size={26} />
        </View>
        <Text className="text-center text-lg font-extrabold text-slate-900">
          Couldn’t load your dashboard
        </Text>
        <Text className="mt-2 text-center text-[13px] leading-5 text-slate-500">
          {getErrorMessage(error)}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => refetch()}
          className="mt-5 rounded-[13px] bg-emerald-700 px-6 py-3"
        >
          <Text className="text-[13px] font-extrabold text-white">Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!restaurant?.id) {
    return <Redirect href="/(restaurant)/create-restaurant" />;
  }

  const rating = Number(restaurant.rating);
  const firstName = user?.firstName?.trim() || "there";

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 118 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-3">
          <View className="mb-[22px] flex-row items-center justify-between">
            <View>
              <Text className="mb-1.5 text-[10px] font-extrabold tracking-[1.6px] text-emerald-700">
                RESTAURANT WORKSPACE
              </Text>
              <Text className="text-[23px] font-extrabold tracking-tight text-slate-900">
                Good to see you, {firstName}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Restaurant profile"
              onPress={() => router.push("/(restaurant)/(tabs)/profile")}
              className="h-11 w-11 items-center justify-center rounded-[15px] border border-slate-200 bg-white"
            >
              <Store size={20} color="#16845C" />
            </Pressable>
          </View>

          <View className="mb-7 overflow-hidden rounded-[25px] bg-[#173D37] p-5">
            <View className="absolute -right-11 -top-[72px] h-[190px] w-[190px] rounded-full bg-emerald-200/10" />
            <View className="mb-[18px] flex-row items-center justify-between">
              <View className="h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-white/10">
                <Store size={21} color="#D8F4E7" />
              </View>
              <View
                className={`flex-row items-center gap-2 rounded-full px-3 py-2 ${
                  restaurant.isOpen ? "bg-emerald-900" : "bg-rose-950"
                }`}
              >
                <View
                  className={`h-[7px] w-[7px] rounded-full ${
                    restaurant.isOpen ? "bg-emerald-300" : "bg-orange-300"
                  }`}
                />
                <Text
                  className={`text-[9px] font-extrabold tracking-[0.8px] ${
                    restaurant.isOpen ? "text-emerald-100" : "text-orange-100"
                  }`}
                >
                  {restaurant.isOpen ? "OPEN NOW" : "CURRENTLY CLOSED"}
                </Text>
              </View>
            </View>

            <Text className="text-[25px] font-extrabold tracking-tight text-white">
              {restaurant.name}
            </Text>
            <Text className="mt-1 text-[13px] text-emerald-100/80">
              {restaurant.cuisineType} · Restaurant
            </Text>

            <View className="my-[18px] h-px bg-white/15" />

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <Star size={16} color="#F9C66A" fill="#F9C66A" />
                <Text className="text-[15px] font-extrabold text-white">
                  {rating > 0 ? rating.toFixed(1) : "New"}
                </Text>
                <Text className="ml-px text-xs text-emerald-100/80">
                  {rating > 0 ? "rating" : "no ratings yet"}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  restaurant.isOpen ? "Close restaurant" : "Open restaurant"
                }
                disabled={toggleMutation.isPending}
                onPress={() => toggleMutation.mutate()}
                className={`min-h-10 flex-row items-center justify-center gap-2 rounded-[13px] px-3.5 ${
                  restaurant.isOpen ? "bg-emerald-50" : "bg-emerald-700"
                } ${toggleMutation.isPending ? "opacity-70" : ""}`}
              >
                {toggleMutation.isPending ? (
                  <ActivityIndicator
                    size="small"
                    color={restaurant.isOpen ? "#16845C" : "#FFFFFF"}
                  />
                ) : (
                  <Power
                    size={15}
                    color={restaurant.isOpen ? "#16845C" : "#FFFFFF"}
                  />
                )}
                <Text
                  className={`text-xs font-bold ${
                    restaurant.isOpen ? "text-emerald-800" : "text-white"
                  }`}
                >
                  {restaurant.isOpen ? "Close store" : "Open store"}
                </Text>
              </Pressable>
            </View>
          </View>

          {toggleMutation.isError && (
            <View className="-mt-4 mb-[22px] flex-row items-center gap-2 rounded-[13px] bg-rose-50 p-3">
              <CircleAlert size={17} color="#C84B4B" />
              <Text className="flex-1 text-xs leading-[17px] text-rose-700">
                {getErrorMessage(toggleMutation.error)}
              </Text>
            </View>
          )}

          <View className="mb-3.5 flex-row items-center justify-between">
            <View>
              <Text className="text-[17px] font-extrabold text-slate-900">
                Your workspace
              </Text>
              <Text className="mt-1 text-xs text-slate-500">
                Keep your restaurant ready for customers
              </Text>
            </View>
            <Clock3 size={19} color="#7A8792" />
          </View>

          <View className="mb-7 rounded-[20px] border border-slate-100 bg-white px-[15px]">
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(restaurant)/update-restaurant")}
              className="min-h-20 flex-row items-center gap-3 py-3"
            >
              <View className="h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-blue-50">
                <MapPin size={19} color="#3C71D9" />
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-[11px] font-semibold text-slate-500">
                  Restaurant address
                </Text>
                <Text
                  className="text-[13px] font-semibold leading-[18px] text-slate-800"
                  numberOfLines={2}
                >
                  {restaurant.address}
                </Text>
              </View>
              <ChevronRight size={18} color="#7A8792" />
            </Pressable>

            <View className="ml-[54px] h-px bg-slate-100" />

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(restaurant)/update-restaurant")}
              className="min-h-20 flex-row items-center gap-3 py-3"
            >
              <View className="h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-emerald-50">
                <Check size={19} color="#1B9A68" />
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-[11px] font-semibold text-slate-500">
                  About your restaurant
                </Text>
                <Text
                  className="text-[13px] font-semibold leading-[18px] text-slate-800"
                  numberOfLines={2}
                >
                  {restaurant.description}
                </Text>
              </View>
              <ChevronRight size={18} color="#7A8792" />
            </Pressable>
          </View>

          <View className="mb-3.5">
            <Text className="text-[17px] font-extrabold text-slate-900">
              Quick actions
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              Make your next update in a tap
            </Text>
          </View>

          <View className="mb-[18px] flex-row gap-3">
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(restaurant)/(tabs)/menu")}
              className="min-h-[145px] flex-1 rounded-[19px] border border-slate-100 bg-white p-3.5 active:opacity-80"
            >
              <View className="mb-[13px] h-10 w-10 items-center justify-center rounded-[13px] bg-violet-50">
                <UtensilsCrossed size={20} color="#8458D8" />
              </View>
              <Text className="text-[13px] font-extrabold text-slate-900">
                Manage menu
              </Text>
              <Text className="mt-1 text-[10px] text-slate-500">
                Update your dishes
              </Text>
              <ArrowUpRight
                size={17}
                color="#7A8792"
                className="absolute right-3.5 top-4"
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(restaurant)/update-restaurant")}
              className="min-h-[145px] flex-1 rounded-[19px] border border-slate-100 bg-white p-3.5 active:opacity-80"
            >
              <View className="mb-[13px] h-10 w-10 items-center justify-center rounded-[13px] bg-orange-50">
                <Plus size={20} color="#D17837" />
              </View>
              <Text className="text-[13px] font-extrabold text-slate-900">
                Edit details
              </Text>
              <Text className="mt-1 text-[10px] text-slate-500">
                Keep info up to date
              </Text>
              <ArrowUpRight
                size={17}
                color="#7A8792"
                className="absolute right-3.5 top-4"
              />
            </Pressable>
          </View>

          <View className="flex-row gap-3 rounded-[18px] border border-amber-100 bg-amber-50 p-[15px]">
            <View className="h-8 w-8 items-center justify-center rounded-[11px] bg-amber-100">
              <Star size={17} color="#A36E11" />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs font-extrabold text-amber-900">
                A little tip
              </Text>
              <Text className="text-[11px] leading-[17px] text-amber-800">
                A complete menu and up-to-date restaurant details help
                customers decide what to order.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
