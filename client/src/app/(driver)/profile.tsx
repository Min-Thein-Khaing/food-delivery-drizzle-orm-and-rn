import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "@/stores/userAuthStore";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Calendar,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Copy,
  Bike,
  Wallet,
  Clock,
  Navigation,
  PhoneCall,
  Lock,
  Star,
} from "lucide-react-native";

export default function DriverProfile() {
  const { user, clearAuth } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Delivery Partner";
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "D";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const handleCopyId = () => {
    if (!user?.id) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to go offline and sign out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            clearAuth();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header Hero Banner */}
        <View className="relative bg-sky-600 px-6 pt-6 pb-12 rounded-b-3xl shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-xs font-semibold uppercase tracking-wider text-sky-200">
                Rider Portal
              </Text>
              <Text className="text-2xl font-bold text-white mt-0.5">
                Driver Profile
              </Text>
            </View>
            <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2" />
              <Text className="text-xs font-medium text-white">On Duty</Text>
            </View>
          </View>

          {/* Driver Avatar & Info */}
          <View className="flex-row items-center">
            {/* Avatar Circle with Initials */}
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center shadow-md border-2 border-white/60 mr-4">
              <Text className="text-2xl font-extrabold text-sky-700">
                {initials}
              </Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center">
                <Text
                  numberOfLines={1}
                  className="text-xl font-bold text-white mr-1.5"
                >
                  {fullName}
                </Text>
                <CheckCircle2 size={18} color="#38BDF8" fill="#FFFFFF" />
              </View>
              <Text numberOfLines={1} className="text-sm text-sky-100 mt-0.5">
                {user?.email ?? "No email linked"}
              </Text>
              <View className="mt-2 self-start bg-sky-700/60 border border-sky-400/40 px-2.5 py-0.5 rounded-full">
                <Text className="text-xs font-medium text-white">
                  Delivery Partner
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Highlights Counter Grid */}
        <View className="px-5 -mt-6">
          <View className="flex-row bg-white rounded-2xl shadow-sm border border-slate-100 p-4 justify-between">
            <View className="flex-1 items-center border-r border-slate-100">
              <Text className="text-xs text-slate-400 font-medium">Rating</Text>
              <View className="flex-row items-center mt-1">
                <Star size={14} color="#f59e0b" fill="#f59e0b" className="mr-1" />
                <Text className="text-sm font-bold text-slate-800 ml-1">4.95</Text>
              </View>
            </View>
            <View className="flex-1 items-center border-r border-slate-100">
              <Text className="text-xs text-slate-400 font-medium">Status</Text>
              <Text className="text-sm font-bold text-emerald-600 mt-1">
                Active
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-xs text-slate-400 font-medium">Joined</Text>
              <Text className="text-sm font-bold text-slate-800 mt-1">
                {memberSince}
              </Text>
            </View>
          </View>
        </View>

        {/* Driver Work & Earnings Shortcuts */}
        <View className="px-5 mt-6">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
            Work & Vehicle
          </Text>

          <View className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Earnings & Payouts */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-4 py-3.5 border-b border-slate-50"
            >
              <View className="w-9 h-9 rounded-xl bg-emerald-50 items-center justify-center mr-3">
                <Wallet size={18} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-800">
                  Earnings & Wallet
                </Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  Daily trips, weekly payouts, incentives
                </Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Vehicle & Documents */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-4 py-3.5 border-b border-slate-50"
            >
              <View className="w-9 h-9 rounded-xl bg-sky-50 items-center justify-center mr-3">
                <Bike size={18} color="#0284c7" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-800">
                  Vehicle & License Info
                </Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  Motorbike details, driving license, registration
                </Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Shift & Trips History */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-4 py-3.5"
            >
              <View className="w-9 h-9 rounded-xl bg-amber-50 items-center justify-center mr-3">
                <Clock size={18} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-800">
                  Completed Delivery History
                </Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  Trip logs, customer tips, ratings
                </Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Details Section */}
        <View className="px-5 mt-6">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
            Account Information
          </Text>

          <View className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Full Name */}
            <View className="flex-row items-center px-4 py-3.5 border-b border-slate-50">
              <View className="w-9 h-9 rounded-xl bg-sky-50 items-center justify-center mr-3">
                <UserIcon size={18} color="#0284c7" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-medium">Driver Name</Text>
                <Text className="text-sm font-semibold text-slate-800 mt-0.5">
                  {fullName}
                </Text>
              </View>
            </View>

            {/* Email Address */}
            <View className="flex-row items-center px-4 py-3.5 border-b border-slate-50">
              <View className="w-9 h-9 rounded-xl bg-violet-50 items-center justify-center mr-3">
                <Mail size={18} color="#7c3aed" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-medium">Email Address</Text>
                <Text className="text-sm font-semibold text-slate-800 mt-0.5">
                  {user?.email ?? "Not configured"}
                </Text>
              </View>
            </View>

            {/* Role & Access */}
            <View className="flex-row items-center px-4 py-3.5 border-b border-slate-50">
              <View className="w-9 h-9 rounded-xl bg-amber-50 items-center justify-center mr-3">
                <ShieldCheck size={18} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-medium">Partner Type</Text>
                <Text className="text-sm font-semibold text-slate-800 mt-0.5">
                  {user?.role ?? "DRIVER"}
                </Text>
              </View>
            </View>

            {/* Member Since */}
            <View className="flex-row items-center px-4 py-3.5 border-b border-slate-50">
              <View className="w-9 h-9 rounded-xl bg-emerald-50 items-center justify-center mr-3">
                <Calendar size={18} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-medium">Partner Since</Text>
                <Text className="text-sm font-semibold text-slate-800 mt-0.5">
                  {memberSince}
                </Text>
              </View>
            </View>

            {/* User ID with Copy Action */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCopyId}
              className="flex-row items-center px-4 py-3.5"
            >
              <View className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center mr-3">
                <Copy size={18} color="#475569" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-medium">Driver ID</Text>
                <Text
                  numberOfLines={1}
                  className="text-xs font-mono font-medium text-slate-700 mt-0.5"
                >
                  {user?.id ?? "N/A"}
                </Text>
              </View>
              <Text className="text-xs text-sky-600 font-medium ml-2">
                {copied ? "Copied!" : "Copy"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety & Support */}
        <View className="px-5 mt-6">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
            Safety & Road Assistance
          </Text>

          <View className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* GPS & Navigation Settings */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-4 py-3.5 border-b border-slate-50"
            >
              <View className="w-9 h-9 rounded-xl bg-blue-50 items-center justify-center mr-3">
                <Navigation size={18} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-800">
                  Navigation & Map Preferences
                </Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  Google Maps, voice navigation, route optimization
                </Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Roadside Emergency Support */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-4 py-3.5 border-b border-slate-50"
            >
              <View className="w-9 h-9 rounded-xl bg-rose-50 items-center justify-center mr-3">
                <PhoneCall size={18} color="#e11d48" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-800">
                  Emergency Support & Help
                </Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  24/7 Rider safety hotline and accident assistance
                </Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Security */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-4 py-3.5"
            >
              <View className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center mr-3">
                <Lock size={18} color="#475569" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-800">
                  Security & Password
                </Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  Manage login credentials and sessions
                </Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-5 mt-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogout}
            className="flex-row items-center justify-center bg-rose-50 border border-rose-200 py-3.5 rounded-2xl shadow-sm"
          >
            <LogOut size={18} color="#e11d48" />
            <Text className="text-sm font-bold text-rose-600 ml-2">
              Go Offline & Sign Out
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-xs text-slate-400 mt-4">
            Food Delivery Rider App • Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}