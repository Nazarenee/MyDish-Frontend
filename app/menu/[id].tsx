import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RecipeImage {
  id: number;
  imageUrl: string;
}

interface RecipeDTO {
  id: number;
  name: string;
  description: string;
  authorName: string;
  likeCount: number;
  commentCount: number;
  images: RecipeImage[];
}

interface MenuDetail {
  id: number;
  name: string;
  description: string;
  authorId: number;
  recipes: RecipeDTO[];
}

const MenuDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menu, setMenu] = useState<MenuDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMenuDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        setError("No token found. Please log in.");
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `https://hovedopgave-mydish-production.up.railway.app/api/menus/${id}`,
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
        throw new Error("Failed to fetch menu details");
      }

      const data = await response.json();
      setMenu(data);
      setError("");
    } catch (err) {
      setError("Failed to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuDetail();
  }, [id]);

  const handleRecipePress = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1a8fe3" />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !menu) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || "Menu not found"}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButtonHeader}
          >
            <Text style={styles.backArrow}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.menuIcon}>📋</Text>
            <View style={styles.titleContent}>
              <Text style={styles.title}>{menu.name}</Text>
              <Text style={styles.recipeCount}>
                {menu.recipes.length}{" "}
                {menu.recipes.length === 1 ? "recipe" : "recipes"}
              </Text>
            </View>
          </View>

          {menu.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{menu.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Recipes ({menu.recipes.length})
            </Text>
            {menu.recipes.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No recipes in this menu yet
                </Text>
              </View>
            ) : (
              menu.recipes.map((recipe) => {
                const imageUrl =
                  recipe.images && recipe.images.length > 0
                    ? recipe.images[0].imageUrl
                    : "https://via.placeholder.com/150x150?text=No+Image";

                return (
                  <TouchableOpacity
                    key={recipe.id}
                    style={styles.recipeCard}
                    onPress={() => handleRecipePress(recipe.id)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.recipeImage}
                    />
                    <View style={styles.recipeInfo}>
                      <Text style={styles.recipeName} numberOfLines={2}>
                        {recipe.name}
                      </Text>
                      <Text style={styles.recipeAuthor}>
                        by {recipe.authorName}
                      </Text>
                      <View style={styles.recipeStats}>
                        <Text style={styles.statText}>
                          ❤️ {recipe.likeCount}
                        </Text>
                        <Text style={styles.statText}>
                          💬 {recipe.commentCount}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButtonHeader: {
    padding: 8,
  },
  backArrow: {
    fontSize: 16,
    color: "#1a8fe3",
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  titleContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  recipeCount: {
    fontSize: 16,
    color: "#1a8fe3",
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: 120,
    height: 120,
    backgroundColor: "#e0e0e0",
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  recipeAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  recipeStats: {
    flexDirection: "row",
    gap: 16,
  },
  statText: {
    fontSize: 14,
    color: "#999",
  },
  emptyState: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
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
  backButton: {
    backgroundColor: "#1a8fe3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MenuDetailPage;
