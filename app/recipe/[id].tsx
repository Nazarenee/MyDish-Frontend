import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>❤️ {recipe.likeCount}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>💬 {recipe.commentCount}</Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View>
          </View>

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
  mainImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#e0e0e0",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
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
  },
  ingredientItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  ingredientBullet: {
    fontSize: 16,
    color: "#1a8fe3",
    marginRight: 8,
    fontWeight: "bold",
  },
  ingredientText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  stepNumberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a8fe3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    flexShrink: 0,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  stepContentContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  stepText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  thumbnailImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#e0e0e0",
  },
  dateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
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

export default RecipeDetailPage;