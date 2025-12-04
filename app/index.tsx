import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./css/index.style";

export default function Index() {
  const router = useRouter();

  function loginRoute() {
    router.push("/login");
  }

  function registerRoute() {
    router.push("/register");
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My-Dish</Text>
        <Text style={styles.subtitle}>Discover and share amazing recipes</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={loginRoute}
            accessibilityLabel="Login"
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={registerRoute}
            accessibilityLabel="Register"
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
