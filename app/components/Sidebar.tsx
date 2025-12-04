import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../css/Sidebar.style";

interface SidebarProps {
  activePage: "menu" | "recipes";
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("jwtToken");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("username");
    router.replace("/login");
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>My Dish</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.sidebarItem,
          activePage === "menu" && styles.sidebarItemActive,
        ]}
        onPress={() => router.push("/menu")}
      >
        <Text style={styles.sidebarText}>Menus</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.sidebarItem,
          activePage === "recipes" && styles.sidebarItemActive,
        ]}
        onPress={() => router.push("/recipeOverview")}
      >
        <Text style={styles.sidebarText}>Recipes</Text>
      </TouchableOpacity>

      <View style={styles.sidebarSpacer} />

      <TouchableOpacity style={styles.sidebarItem} onPress={handleLogout}>
        <Text style={styles.sidebarText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Sidebar;