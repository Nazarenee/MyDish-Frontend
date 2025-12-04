import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "./components/Sidebar";
import styles from "./css/menu.style";

interface RecipeDTO {
  id: number;
  name: string;
  description: string;
}

interface Menu {
  id: number;
  name: string;
  description: string;
  authorId: number;
  authorName: string;
  recipes: RecipeDTO[];
}

const MenuComponent = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [availableRecipes, setAvailableRecipes] = useState<RecipeDTO[]>([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<number[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [viewMode, setViewMode] = useState<"my" | "explore">("my");

  const fetchMenus = async (mode: "my" | "explore" = viewMode) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token) {
        setError("No token found. Please log in.");
        router.replace("/login");
        return;
      }

      const endpoint =
        mode === "my"
          ? `https://hovedopgave-mydish-production.up.railway.app/api/menus/user/${userId}`
          : "https://hovedopgave-mydish-production.up.railway.app/api/menus";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          await AsyncStorage.removeItem("jwtToken");
          router.replace("/login");
          return;
        }
        throw new Error(`Failed to fetch menus: ${response.status}`);
      }

      const data = await response.json();
      setMenus(data);
      setError("");
    } catch (err) {
      console.error("Error fetching menus:", err);
      setError("Failed to load menus. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAvailableRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        Alert.alert("Error", "No token found. Please log in.");
        router.replace("/login");
        return;
      }

      const response = await fetch(
        "https://hovedopgave-mydish-production.up.railway.app/api/recipes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setAvailableRecipes(data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      Alert.alert("Error", "Failed to load recipes. Please try again.");
    } finally {
      setLoadingRecipes(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      fetchAvailableRecipes();
    }
  }, [modalVisible]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMenus();
  };

  const handleMenuPress = (menuId: number) => {
    router.push(`/menu/${menuId}`);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("jwtToken");
    router.replace("/login");
  };

  const handleRecipesPress = () => {
    router.push("/recipeOverview");
  };

  const handleViewModeChange = (mode: "my" | "explore") => {
    setViewMode(mode);
    setLoading(true);
    fetchMenus(mode);
  };

  const toggleRecipeSelection = (recipeId: number) => {
    if (selectedRecipeIds.includes(recipeId)) {
      setSelectedRecipeIds(selectedRecipeIds.filter((id) => id !== recipeId));
    } else {
      setSelectedRecipeIds([...selectedRecipeIds, recipeId]);
    }
  };

  const resetForm = () => {
    setMenuName("");
    setMenuDescription("");
    setSelectedRecipeIds([]);
  };

  const handleCreateMenu = async () => {
    if (!menuName.trim()) {
      Alert.alert("Error", "Please enter a menu name");
      return;
    }
    if (!menuDescription.trim()) {
      Alert.alert("Error", "Please enter a menu description");
      return;
    }

    setCreating(true);

    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token) {
        Alert.alert("Error", "No token found. Please log in.");
        router.replace("/login");
        return;
      }

      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        router.replace("/login");
        return;
      }

      const menuData = {
        name: menuName,
        description: menuDescription,
        authorId: parseInt(userId),
        recipeIds: selectedRecipeIds,
      };

      const response = await fetch(
        "https://hovedopgave-mydish-production.up.railway.app/api/menus",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(menuData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        throw new Error(`Failed to create menu: ${response.status}`);
      }

      Alert.alert("Success", "Menu created successfully!");
      console.log(selectedRecipeIds);
      setModalVisible(false);
      resetForm();
      fetchMenus();
    } catch (err) {
      console.error("Error creating menu:", err);
      Alert.alert("Error", "Failed to create menu. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const renderRecipeCard = ({ item }: { item: Menu }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleMenuPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.recipeCount}>
            <Text style={styles.recipeCountText}>
              {item.recipes?.length || 0} recipes
            </Text>
          </View>
        </View>
        <Text style={styles.cardAuthor}>by {item.authorName}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description || "No description available"}
        </Text>
        {item.recipes && item.recipes.length > 0 && (
          <View style={styles.recipePreview}>
            <Text style={styles.recipePreviewTitle}>Recipes:</Text>
            {item.recipes.slice(0, 3).map((recipe, index) => (
              <Text key={recipe.id} style={styles.recipePreviewItem}>
                • {recipe.name}
              </Text>
            ))}
            {item.recipes.length > 3 && (
              <Text style={styles.recipePreviewMore}>
                +{item.recipes.length - 3} more...
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderRecipeSelectionItem = ({ item }: { item: RecipeDTO }) => {
    const isSelected = selectedRecipeIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.recipeSelectionItem,
          isSelected && styles.recipeSelectionItemSelected,
        ]}
        onPress={() => toggleRecipeSelection(item.id)}
      >
        <View style={styles.recipeSelectionContent}>
          <Text style={styles.recipeSelectionName}>{item.name}</Text>
          <Text style={styles.recipeSelectionDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View
          style={[
            styles.recipeCheckbox,
            isSelected && styles.recipeCheckboxSelected,
          ]}
        >
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1a8fe3" />
          <Text style={styles.loadingText}>Loading menus...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchMenus()}>     
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
      <Sidebar activePage="menu" />
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>
                {viewMode === "my" ? "My Menus" : "Explore Menus"}
              </Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    viewMode === "my" && styles.toggleButtonActive,
                  ]}
                  onPress={() => handleViewModeChange("my")}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      viewMode === "my" && styles.toggleButtonTextActive,
                    ]}
                  >
                    My Menus
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    viewMode === "explore" && styles.toggleButtonActive,
                  ]}
                  onPress={() => handleViewModeChange("explore")}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      viewMode === "explore" && styles.toggleButtonTextActive,
                    ]}
                  >
                    Explore Menus
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.createButtonText}>+ Create Menu</Text>
            </TouchableOpacity>
          </View>

          {menus.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                {viewMode === "my"
                  ? "You haven't created any menus yet"
                  : "No menus found"}
              </Text>
              <Text style={styles.emptySubtext}>
                {viewMode === "my"
                  ? "Create your first menu to get started!"
                  : ""}
              </Text>
            </View>
          ) : (
            <FlatList
              data={menus}
              renderItem={renderRecipeCard}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#1a8fe3"]}
                />
              }
            />
          )}
        </View>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Menu</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Menu Name *</Text>
              <TextInput
                style={styles.input}
                value={menuName}
                onChangeText={setMenuName}
                placeholder="e.g., Sunday Brunch Menu"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={menuDescription}
                onChangeText={setMenuDescription}
                placeholder="Describe your menu..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />

              <Text style={styles.sectionTitle}>
                Select Recipes ({selectedRecipeIds.length} selected)
              </Text>

              {loadingRecipes ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#1a8fe3" />
                  <Text style={styles.loadingText}>Loading recipes...</Text>
                </View>
              ) : availableRecipes.length === 0 ? (
                <View style={styles.emptyRecipesContainer}>
                  <Text style={styles.emptyRecipesText}>
                    No recipes available. Create some recipes first!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={availableRecipes}
                  renderItem={renderRecipeSelectionItem}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.recipesList}
                  scrollEnabled={false}
                />
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.createButton, creating && styles.buttonDisabled]}
                onPress={handleCreateMenu}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>Create Menu</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MenuComponent;