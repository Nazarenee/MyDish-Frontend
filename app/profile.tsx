import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "./components/Sidebar";
import styles from "./css/profile.style";

interface UserProfile {
  userId: number;
  username: string; 
  profileImage: string;
}

const ProfileComponent = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Error", "Please log in.");
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `https://hovedopgave-mydish-production.up.railway.app/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      console.log("Profile data received:", data);
      
      setProfile(data);
      setUsername(data.username || "");  
      setProfileImageUrl(data.profileImage || "");
    } catch (err) {
      console.error("Error fetching profile:", err);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!profile) {
      setErrorMessage("Profile data not loaded");
      return;
    }

    const usernameChanged = username.trim() !== profile.username;  
    const profileImageChanged = profileImageUrl.trim() !== (profile.profileImage || "");
    const isChangingPassword = !!(newPassword && currentPassword);

    console.log("usernameChanged:", usernameChanged);
    console.log("profileImageChanged:", profileImageChanged);
    console.log("isChangingPassword:", isChangingPassword);

    if (usernameChanged) {
      if (!username || !username.trim()) {
        setErrorMessage("Username cannot be empty");
        return;
      }

      if (username.trim().length < 3 || username.trim().length > 50) {
        setErrorMessage("Username must be between 3 and 50 characters");
        return;
      }
    }

    if (isChangingPassword) {
      if (!newPassword.trim()) {
        setErrorMessage("New password cannot be empty");
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage("New passwords do not match");
        return;
      }

      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordPattern.test(newPassword)) {
        setErrorMessage(
          "Password must be at least 8 characters and contain 1 uppercase, 1 lowercase, and 1 digit"
        );
        return;
      }

      if (!currentPassword || !currentPassword.trim()) {
        setErrorMessage("Current password is required to change password");
        return;
      }
    } else if (currentPassword && !newPassword) {
      setErrorMessage("Please enter a new password or leave current password blank");
      return;
    }

    if (!usernameChanged && !profileImageChanged && !isChangingPassword) {
      setErrorMessage("No changes to save");
      return;
    }

    setUpdating(true);

    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Error", "Please log in.");
        setUpdating(false);
        return;
      }

      const updateData: any = {};

      if (usernameChanged) {
        updateData.username = username.trim(); 
      }

      if (profileImageChanged) {
        updateData.profileImage = profileImageUrl.trim() || "";
      }

      if (isChangingPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      console.log("Update request body:", JSON.stringify(updateData, null, 2));

      const response = await fetch(
        `https://hovedopgave-mydish-production.up.railway.app/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMsg = "Failed to update profile";
        
        try {
          const errorData = await response.json();
          
          if (errorData.userName) {
            errorMsg = errorData.userName;
          } else if (errorData.username) {
            errorMsg = errorData.username;
          } else if (errorData.password) {
            errorMsg = errorData.password;
          } else if (errorData.message) {
            errorMsg = errorData.message;
          } else if (errorData.error) {
            errorMsg = errorData.error;
          }
          
          if (response.status === 400 && errorMsg.includes("Bad Request")) {
            errorMsg = "Current password is incorrect";
          }
        } catch (parseError) {
          if (response.status === 400) {
            errorMsg = "Current password is incorrect or invalid data provided";
          } else if (response.status === 409) {
            errorMsg = "Username already exists";
          } else if (response.status === 403) {
            errorMsg = "You don't have permission to update this profile";
          } else {
            errorMsg = response.statusText || errorMsg;
          }
        }
        
        setErrorMessage(errorMsg);
        return;
      }

      const data = await response.json();
console.log("Success response:", JSON.stringify(data, null, 2));

if (usernameChanged) {
  if (data.username) {
    await AsyncStorage.setItem("username", data.username);
  }
  
  if (data.token) {
    await AsyncStorage.setItem("jwtToken", data.token);
    console.log("New token stored after username change");
  }
}

setSuccessMessage("Profile updated successfully!");
setCurrentPassword("");
setNewPassword("");
setConfirmPassword("");

setTimeout(() => {
  fetchProfile();
}, 500);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setErrorMessage(err.message || "Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1a8fe3" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Sidebar activePage="profile" />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.profileImageSection}>
              {profileImageUrl ? (
                <Image
                  source={{ uri: profileImageUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <Text style={styles.label}>Profile Image URL</Text>
              <TextInput
                style={styles.input}
                value={profileImageUrl}
                onChangeText={setProfileImageUrl}
                placeholder="Enter image URL (optional)"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Information</Text>

              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              <Text style={styles.helperText}>
                You can update your username here
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Change Password</Text>
              <Text style={styles.helperText}>
                Leave blank if you don't want to change your password
              </Text>

              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
              />

              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password (min 8 chars)"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
              />

              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.button, updating && styles.buttonDisabled]}
              onPress={handleUpdateProfile}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Update Profile</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileComponent;