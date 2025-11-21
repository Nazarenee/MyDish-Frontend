import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const registerComponent = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  async function register() {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(
        "https://hovedopgave-mydish-production.up.railway.app/api/auth/register",
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
        let msg = "";

        if (data.userName) msg += data.userName + "\n";
        if (data.password) msg += data.password;

        setErrorMessage(msg.trim());
        return;
      }
      setErrorMessage("");
      setSuccessMessage("User registered!");
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

          <Button onPress={register} title="Register" color="#1a8fe3" />

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

export default registerComponent;
