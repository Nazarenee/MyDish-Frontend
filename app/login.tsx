import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Button, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styles from "./css/login.style";

const LoginComponent = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  async function login() {
  setErrorMessage("");
  setSuccessMessage("");
  try {
    const response = await fetch(
      "https://hovedopgave-mydish-production.up.railway.app/api/users/login",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    if (!response.ok) {
      let errorMsg = "Login failed. Please check your credentials.";
      
      if (response.status === 403 || response.status === 401) {
        errorMsg = "Invalid username or password.";
        setErrorMessage(errorMsg);
        return;
      }
      
      try {
        const data = await response.json();
        
        if (data.message) {
          errorMsg = data.message;
        } else if (data.error) {
          errorMsg = data.error;
        }
      } catch (parseError) {
        errorMsg = `Error: ${response.statusText}`;
      }
      
      setErrorMessage(errorMsg);
      return;
    }

    const data = await response.json();

    if (data.token) {
      await AsyncStorage.setItem("jwtToken", data.token);
    }

    if (data.userId) {
      await AsyncStorage.setItem("userId", String(data.userId));
    }
    
    if (data.userName) {
      await AsyncStorage.setItem("username", data.userName);
    }

    setSuccessMessage("Logged in successfully!");

    router.replace("/recipeOverview");
  } catch (error) {
    console.error("Login error:", error);
    setErrorMessage("Network error. Try again later.");
  }
}

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={{ padding: 12 }}>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Username"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry
          />

          <Button onPress={login} title="Login" color="#1a8fe3" />

          {errorMessage !== "" && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          {successMessage !== "" && (
            <Text style={styles.successText}>{successMessage}</Text>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LoginComponent;