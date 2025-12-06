import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import styles from "../css/Sidebar.style";

interface SidebarProps {
  activePage: "menu" | "recipes" | "profile";
}

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("jwtToken");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("username");
    router.replace("/login");
  };

  const handleNavigation = (route: any) => {
    if (isSmallScreen) {
      setIsOpen(false);
    }
    router.push(route);
  };

  const SidebarContent = () => (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>My Dish</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.sidebarItem,
          activePage === "menu" && styles.sidebarItemActive,
        ]}
        onPress={() => handleNavigation("/menu")}
      >
        <Text style={styles.sidebarIcon}>📋</Text>
        <Text style={styles.sidebarText}>Menus</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.sidebarItem,
          activePage === "recipes" && styles.sidebarItemActive,
        ]}
        onPress={() => handleNavigation("/recipeOverview")}
      >
        <Text style={styles.sidebarIcon}>🍳</Text>
        <Text style={styles.sidebarText}>Recipes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.sidebarItem,
          activePage === "profile" && styles.sidebarItemActive,
        ]}
        onPress={() => handleNavigation("/profile")}
      >
        <Text style={styles.sidebarIcon}>👤</Text>
        <Text style={styles.sidebarText}>Profile</Text>
      </TouchableOpacity>

      <View style={styles.sidebarSpacer} />

      <TouchableOpacity style={styles.sidebarItem} onPress={handleLogout}>
        <Text style={styles.sidebarIcon}>🚪</Text>
        <Text style={styles.sidebarText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );

  if (isSmallScreen) {
    return (
      <>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => setIsOpen(true)}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>

        <Modal
          visible={isOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalSidebar}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsOpen(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                  <SidebarContent />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  }

  // On desktop, show normal sidebar
  return <SidebarContent />;
};

export default Sidebar;