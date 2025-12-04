import React from "react";
import { Button, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styles from "./css/register.style";

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
      "https://hovedopgave-mydish-production.up.railway.app/api/users/register",
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
      let errorMsg = "Registration failed. Please try again.";
      
      if (response.status === 409) {
        errorMsg = "Username already exists. Please choose a different username.";
        setErrorMessage(errorMsg);
        return;
      }
      
      try {
        const data = await response.json();
        
        if (data.userName || data.password || data.username) {
          let msg = "";
          if (data.userName) msg += data.userName + "\n";
          if (data.username) msg += data.username + "\n";
          if (data.password) msg += data.password;
          errorMsg = msg.trim();
        } 
        else if (data.message) {
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
    setErrorMessage("");
    setSuccessMessage("User registered successfully!");
  } catch (error) {
    console.error("Registration error:", error);
    setErrorMessage("Network error. Please try again later.");
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

export default registerComponent;