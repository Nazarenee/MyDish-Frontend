import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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
        "https://hovedopgave-mydish-production.up.railway.app/api/auth/login",
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

      const data = await response.json();

      if (!response.ok) {
        if (data.message) {
          setErrorMessage(data.message);
        } else if (data.error) {
          setErrorMessage(data.error);
        } else {
          setErrorMessage("Login failed. Please check your credentials.");
        }
        return;
      }

      if (data.token) {
        await AsyncStorage.setItem("jwtToken", data.token);
      }

      if (data.userId || data.id) {
        await AsyncStorage.setItem("userId", String(data.userId || data.id));
      }
      if (data.username || username) {
        await AsyncStorage.setItem("username", data.username || username);
      }

      setSuccessMessage("Logged in successfully!");

      router.replace("/overview");
    } catch (error) {
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

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  errorText: {
    marginTop: 10,
    color: "red",
    fontSize: 14,
  },
  successText: {
    marginTop: 10,
    color: "green",
    fontSize: 14,
  },
});

export default LoginComponent;
