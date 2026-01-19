import { supabase } from "@/services/supabase";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Intro from "./intro";

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace("/(notes)/task");
    };
    checkSession();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <Intro />
    </SafeAreaView>
  );
}
