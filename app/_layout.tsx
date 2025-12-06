import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="recipeOverview" options={{ title: "Recipes" }} />
      <Stack.Screen name="menu" options={{ title: "Menu" }} />
    </Stack>
  );
}