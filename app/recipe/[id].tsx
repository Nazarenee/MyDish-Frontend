import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../css/recipe.id";

interface Ingredient {
  id: number;
  name: string;
  amount: number | null;
  unit: string | null;
  averageCookingTime: number | null;
}

interface RecipeImage {
  id: number;
  imageUrl: string;
}

interface RecipeDetail {
  id: number;
  name: string;
  description: string;
  ingredients: Ingredient[];
  authorId: number;
  authorName: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  likedByCurrentUser: boolean;
  images: RecipeImage[];
  enableComments: boolean;
  stepByStepGuide?: string[];
}

const RecipeDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      setCurrentUserId(userId);
    };
    getCurrentUser();
  }, []);

  const fetchRecipeDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        setError("No token found. Please log in.");
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `https://hovedopgave-mydish-production.up.railway.app/api/recipes/${id}`,
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
        throw new Error("Failed to fetch recipe details");
      }

      const data = await response.json();
      setRecipe(data);
      setError("");
    } catch (err) {
      setError("Failed to load recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetail();
  }, [id]);

  const handleDeleteRecipe = async () => {
    try {
      setDeleting(true);
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        setError("No token found. Please log in.");
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `https://hovedopgave-mydish-production.up.railway.app/api/recipes/${id}`,
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
        throw new Error("Failed to delete recipe");
      }

      router.replace("/recipeOverview");
    } catch (err) {
      setError("Failed to delete recipe. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1a8fe3" />
          <Text style={styles.loadingText}>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || "Recipe not found"}</Text>
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

  const mainImage =
    recipe.images && recipe.images.length > 0
      ? recipe.images[0].imageUrl
      : "https://via.placeholder.com/400x300?text=No+Image";

  const isAuthor = currentUserId && recipe.authorId === parseInt(currentUserId);

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

        <Image source={{ uri: mainImage }} style={styles.mainImage} />

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.author}>by {recipe.authorName}</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Ingredients ({recipe.ingredients.length})
            </Text>
            {recipe.ingredients.map((ingredient) => (
              <View key={ingredient.id} style={styles.ingredientItem}>
                <Text style={styles.ingredientBullet}>•</Text>
                <Text style={styles.ingredientText}>
                  {ingredient.name}
                  {ingredient.amount && ingredient.unit
                    ? ` - ${ingredient.amount} ${ingredient.unit.toLowerCase()}`
                    : ""}
                  {ingredient.averageCookingTime
                    ? ` (${ingredient.averageCookingTime} min)`
                    : ""}
                </Text>
              </View>
            ))}
          </View>

          {recipe.stepByStepGuide && recipe.stepByStepGuide.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
              {recipe.stepByStepGuide.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                  <View style={styles.stepNumberCircle}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepContentContainer}>
                    <Text style={styles.stepTitle}>Step {index + 1}</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {recipe.images.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>More Images</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recipe.images.slice(1).map((image) => (
                  <Image
                    key={image.id}
                    source={{ uri: image.imageUrl }}
                    style={styles.thumbnailImage}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          <Text style={styles.dateText}>
            Created: {new Date(recipe.createdAt).toLocaleDateString()}
          </Text>

          {isAuthor && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteRecipe}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.deleteButtonText}>Delete Recipe</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipeDetailPage;