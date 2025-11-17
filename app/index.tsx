import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  function loginRoute() {
    router.push("/login");
  }

  function registerRoute() {
    router.push("/register");
  }

  return (
    <View>
      <Text>Welcome to My-Dish app!</Text>
      <Button
        onPress={loginRoute}
        title="Login"
        color="#1a8fe3"
        accessibilityLabel="Login"
      />
      <Button
        onPress={registerRoute}
        title="Register"
        color="#1a8fe3"
        accessibilityLabel="Register"
      />
    </View>
  );
}
