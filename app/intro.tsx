import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function intro() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <View className="w-full px-8">
        {/* App Logo / Title */}
        <Text className="text-4xl font-bold text-center text-gray-900 mb-8">
          Diploma Notes
        </Text>
        <Text className="text-gray-500 text-center mb-12">
          Please sign in or sign up to continue
        </Text>

        {/* Sign In */}
        <TouchableOpacity
          className="bg-black rounded-xl py-4 mb-4"
          onPress={() => router.push("./(auth)/SignIn/signin")}
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-semibold text-base">
            Sign In
          </Text>
        </TouchableOpacity>

        {/* Sign Up */}
        <TouchableOpacity
          className="bg-gray-200 rounded-xl py-4"
          onPress={() => router.push("./(auth)/SignUp/signup")}
          activeOpacity={0.8}
        >
          <Text className="text-gray-900 text-center font-semibold text-base">
            Sign Up
          </Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}
