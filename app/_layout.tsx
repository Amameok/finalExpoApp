import "@/global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="intro" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/SignIn/signin" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/SignUp/signup" options={{ headerShown: false }} />
      <Stack.Screen name="(notes)" options={{ headerShown: false}} />
    </Stack>
  );
}