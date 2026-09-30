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
  Store,
  Bell,
  CheckCircle2,
  Copy,
  Lock,
} from "lucide-react-native";

export default function Profile() {
  const { user, clearAuth } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Account User";
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "U";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const roleLabel =
    user?.role === "RESTAURANT_OWNER"
      ? "Restaurant Partner"
      : user?.role === "CUSTOMER"
      ? "Customer"
      : user?.role === "DRIVER"
      ? "Rider / Driver"
      : user?.role ?? "Member";

  const handleCopyId = () => {
    if (!user?.id) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out of your account?",
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
                Partner Portal
              </Text>
              <Text className="text-2xl font-bold text-white mt-0.5">
                My Profile
              </Text>
            </View>
            <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
              <View
                className={`w-2.5 h-2.5 rounded-full mr-2 ${
                  user?.isOnline ? "bg-emerald-400" : "bg-emerald-400"
                }`}
              />
              <Text className="text-xs font-medium text-white">Online</Text>
            </View>
          </View>

          {/* User Avatar & Name Card */}
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
                  {roleLabel}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Highlights Counter Grid */}
        <View className="px-5 -mt-6">
          <View className="flex-row bg-white rounded-2xl shadow-sm border border-slate-100 p-4 justify-between">
            <View className="flex-1 items-center border-r border-slate-100">
              <Text className="text-xs text-slate-400 font-medium">Status</Text>
              <Text className="text-sm font-bold text-emerald-600 mt-1">
                Active
              </Text>
            </View>
            <View className="flex-1 items-center border-r border-slate-100">
              <Text className="text-xs text-slate-400 font-medium">Role</Text>
              <Text className="text-sm font-bold text-slate-800 mt-1">
                Owner
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
                <Text className="text-xs text-slate-400 font-medium">Full Name</Text>
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
                <Text className="text-xs text-slate-400 font-medium">Role & Permission</Text>
                <Text className="text-sm font-semibold text-slate-800 mt-0.5">
                  {user?.role ?? "Not specified"}
                </Text>
              </View>
            </View>

            {/* Member Since */}
            <View className="flex-row items-center px-4 py-3.5 border-b border-slate-50">
              <View className="w-9 h-9 rounded-xl bg-emerald-50 items-center justify-center mr-3">
                <Calendar size={18} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-medium">Member Since</Text>
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
                <Text className="text-xs text-slate-400 font-medium">Account ID</Text>
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

        {/* System & Management Section */}
        <View className="px-5 mt-6">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
            System & Settings
          </Text>

          <View className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Push Notifications */}
            <View className="flex-row items-center px-4 py-3.5 border-b border-slate-50">
              <View className="w-9 h-9 rounded-xl bg-blue-50 items-center justify-center mr-3">
                <Bell size={18} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-medium">Push Notifications</Text>
                <Text className="text-sm font-semibold text-slate-800 mt-0.5">
                  {user?.pushToken ? "Enabled" : "Active"}
                </Text>
              </View>
              <View className="bg-emerald-50 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-semibold text-emerald-600">Active</Text>
              </View>
            </View>

            {/* Restaurant Store Profile */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-4 py-3.5 border-b border-slate-50"
            >
              <View className="w-9 h-9 rounded-xl bg-orange-50 items-center justify-center mr-3">
                <Store size={18} color="#ea580c" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-800">
                  Restaurant Settings
                </Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  Business hours, store address, contact
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
              Log Out of Account
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-xs text-slate-400 mt-4">
            Food Delivery Partner App • Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}