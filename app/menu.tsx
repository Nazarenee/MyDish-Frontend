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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const fetchMenus = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        setError("No token found. Please log in.");
        router.replace("/login");
        return;
      }

      const response = await fetch(
        "https://hovedopgave-mydish-production.up.railway.app/api/menus",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
    router.push("/overview");
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchMenus}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>My Dish</Text>
          </View>

          <TouchableOpacity
            style={[styles.sidebarItem, styles.sidebarItemActive]}
            onPress={() => {}}
          >
            <Text style={styles.sidebarIcon}>📋</Text>
            <Text style={styles.sidebarText}>Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={handleRecipesPress}
          >
            <Text style={styles.sidebarIcon}>🍳</Text>
            <Text style={styles.sidebarText}>Recipes</Text>
          </TouchableOpacity>

          <View style={styles.sidebarSpacer} />

          <TouchableOpacity style={styles.sidebarItem} onPress={handleLogout}>
            <Text style={styles.sidebarIcon}>🚪</Text>
            <Text style={styles.sidebarText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Menus</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.createButtonText}>+ Create Menu</Text>
            </TouchableOpacity>
          </View>

          {menus.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No menus found</Text>
              <Text style={styles.emptySubtext}>
                Create your first menu to get started!
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

      {/* Create Menu Modal */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 200,
    backgroundColor: "#2c3e50",
    paddingTop: 20,
  },
  sidebarHeader: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#34495e",
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  sidebarItemActive: {
    backgroundColor: "#34495e",
    borderLeftColor: "#1a8fe3",
  },
  sidebarIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sidebarText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  sidebarSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  createButton: {
    backgroundColor: "#1a8fe3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  recipeCount: {
    backgroundColor: "#1a8fe3",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recipeCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  recipePreview: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
  },
  recipePreviewTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  recipePreviewItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  recipePreviewMore: {
    fontSize: 14,
    color: "#1a8fe3",
    fontWeight: "600",
    marginTop: 4,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: "#1a8fe3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  modalClose: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 24,
    color: "#999",
  },
  modalBody: {
    padding: 20,
    maxHeight: 500,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 24,
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyRecipesContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyRecipesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  recipesList: {
    maxHeight: 300,
  },
  recipeSelectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  recipeSelectionItemSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#1a8fe3",
  },
  recipeSelectionContent: {
    flex: 1,
    marginRight: 12,
  },
  recipeSelectionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  recipeSelectionDescription: {
    fontSize: 14,
    color: "#666",
  },
  recipeCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  recipeCheckboxSelected: {
    backgroundColor: "#1a8fe3",
    borderColor: "#1a8fe3",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1a8fe3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 12,
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: "#1a8fe3",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default MenuComponent;
