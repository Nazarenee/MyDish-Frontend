import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../css/menu.id";

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
  authorName: string;
  recipes: RecipeDTO[];
}

const MenuDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menu, setMenu] = useState<MenuDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteMenu = async () => {
    try {
      setDeleting(true);
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        setError("No token found. Please log in.");
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `https://hovedopgave-mydish-production.up.railway.app/api/menus/${id}`,
        {
          method: "DELETE",
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
        throw new Error("Failed to delete menu");
      }

      router.replace("/menu");
    } catch (err) {
      setError("Failed to delete menu. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

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
            <View style={styles.titleContent}>
              <Text style={styles.title}>{menu.name}</Text>
              <Text style={styles.recipeCount}>
                {menu.recipes.length}{" "}
                {menu.recipes.length === 1 ? "recipe" : "recipes"}
              </Text>
              <Text style={styles.cardAuthor}>by {menu.authorName}</Text>
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
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteMenu}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete Menu</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default MenuDetailPage;
