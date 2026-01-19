import "@/global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="task" options={{ title: "Notes", headerShown: false }} />
    </Stack>
  );
}