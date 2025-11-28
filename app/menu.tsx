import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
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

  useEffect(() => {
    fetchMenus();
  }, []);

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

  const renderMenuCard = ({ item }: { item: Menu }) => {
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
              renderItem={renderMenuCard}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
});

export default MenuComponent;
