import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 48,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  loginButton: {
    backgroundColor: "#1a8fe3",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1a8fe3",
  },
  registerButtonText: {
    color: "#1a8fe3",
    fontSize: 18,
    fontWeight: "600",
  },
});
