import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./css/overview.style";

interface RecipeImage {
  id: number;
  imageUrl: string;
}

interface Comment {
  id: number;
  bodyText: string;
  userName: string;
  userId: number;
  created: string;
  likeCount: number;
  likedByCurrentUser: boolean;
}

interface Recipe {
  id: number;
  name: string;
  description: string;
  authorName: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  images: RecipeImage[];
  stepByStepGuide?: string[];
}

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  averageCookingTime: string;
}

const OverviewComponent = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [enableComments, setEnableComments] = useState(true);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "", unit: "GRAM", averageCookingTime: "" },
  ]);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);

  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const [viewMode, setViewMode] = useState<"my" | "explore">("my");

  const fetchRecipes = async (mode: "my" | "explore" = viewMode) => {
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
          ? `https://hovedopgave-mydish-production.up.railway.app/api/recipes/user/${userId}`
          : "https://hovedopgave-mydish-production.up.railway.app/api/recipes";

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
        throw new Error(`Failed to fetch recipes: ${response.status}`);
      }

      const data = await response.json();
      setRecipes(data);
      setError("");
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Failed to load recipes. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchComments = async (recipeId: number) => {
    setLoadingComments(true);
    try {
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        Alert.alert("Error", "No token found. Please log in.");
        return;
      }

      const response = await fetch(
        `https://hovedopgave-mydish-production.up.railway.app/api/comments/recipe/${recipeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      Alert.alert("Error", "Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLikeToggle = async (recipeId: number) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Error", "Please log in.");
        return;
      }

      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) return;

      if (recipe.likedByCurrentUser) {
        const response = await fetch(
          `https://hovedopgave-mydish-production.up.railway.app/api/likes/recipe/${recipeId}/user/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setRecipes((prev) =>
            prev.map((r) =>
              r.id === recipeId
                ? {
                    ...r,
                    likeCount: r.likeCount - 1,
                    likedByCurrentUser: false,
                  }
                : r
            )
          );
        }
      } else {
        const response = await fetch(
          "https://hovedopgave-mydish-production.up.railway.app/api/likes",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recipeId: recipeId,
              userId: parseInt(userId),
            }),
          }
        );

        if (response.ok) {
          setRecipes((prev) =>
            prev.map((r) =>
              r.id === recipeId
                ? {
                    ...r,
                    likeCount: r.likeCount + 1,
                    likedByCurrentUser: true,
                  }
                : r
            )
          );
        }
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      Alert.alert("Error", "Failed to update like");
    }
  };

  const handleCommentLikeToggle = async (commentId: number) => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Error", "Please log in.");
        return;
      }

      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;

      if (comment.likedByCurrentUser) {
        const response = await fetch(
          `https://hovedopgave-mydish-production.up.railway.app/api/likes/comment/${commentId}/user/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === commentId
                ? {
                    ...c,
                    likeCount: c.likeCount - 1,
                    likedByCurrentUser: false,
                  }
                : c
            )
          );
        }
      } else {
        const response = await fetch(
          "https://hovedopgave-mydish-production.up.railway.app/api/likes",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              commentId: commentId,
              userId: parseInt(userId),
            }),
          }
        );

        if (response.ok) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === commentId
                ? {
                    ...c,
                    likeCount: c.likeCount + 1,
                    likedByCurrentUser: true,
                  }
                : c
            )
          );
        }
      }
    } catch (err) {
      console.error("Error toggling comment like:", err);
      Alert.alert("Error", "Failed to update like");
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !selectedRecipeId) return;

    setPostingComment(true);
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Error", "Please log in.");
        return;
      }

      const response = await fetch(
        "https://hovedopgave-mydish-production.up.railway.app/api/comments",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bodyText: newComment,
            recipeId: selectedRecipeId,
            userId: parseInt(userId),
          }),
        }
      );

      if (response.ok) {
        setNewComment("");
        fetchComments(selectedRecipeId);
        setRecipes((prev) =>
          prev.map((r) =>
            r.id === selectedRecipeId
              ? { ...r, commentCount: r.commentCount + 1 }
              : r
          )
        );
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      Alert.alert("Error", "Failed to post comment");
    } finally {
      setPostingComment(false);
    }
  };

  const openCommentsModal = (recipeId: number) => {
    setSelectedRecipeId(recipeId);
    setCommentsModalVisible(true);
    fetchComments(recipeId);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecipes();
  };

  const handleRecipePress = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("jwtToken");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("username");
    router.replace("/login");
  };

  const handleViewModeChange = (mode: "my" | "explore") => {
    setViewMode(mode);
    setLoading(true);
    fetchRecipes(mode);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", amount: "", unit: "GRAM", averageCookingTime: "" },
    ]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrl = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
  };

  const updateImageUrl = (index: number, value: string) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const resetForm = () => {
    setRecipeName("");
    setRecipeDescription("");
    setEnableComments(true);
    setIngredients([
      { name: "", amount: "", unit: "GRAM", averageCookingTime: "" },
    ]);
    setImageUrls([""]);
    setSteps([""]);
  };

  const handleCreateRecipe = async () => {
    if (!recipeName.trim()) {
      Alert.alert("Error", "Please enter a recipe name");
      return;
    }
    if (!recipeDescription.trim()) {
      Alert.alert("Error", "Please enter a recipe description");
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.name.trim());
    if (validIngredients.length === 0) {
      Alert.alert("Error", "Please add at least one ingredient");
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

      const ingredientsData = validIngredients.map((ing) => ({
        name: ing.name,
        amount: ing.amount ? parseFloat(ing.amount) : null,
        unit: ing.unit || null,
        averageCookingTime: ing.averageCookingTime
          ? parseInt(ing.averageCookingTime)
          : null,
      }));

      const validImageUrls = imageUrls
        .filter((url) => url.trim())
        .map((url) => ({ imageUrl: url.trim() }));

      const validSteps = steps.filter((step) => step.trim());

      const recipeData = {
        name: recipeName,
        description: recipeDescription,
        enableComments: enableComments,
        authorId: parseInt(userId),
        ingredients: ingredientsData,
        images: validImageUrls,
        stepByStepGuide: validSteps,
      };

      const response = await fetch(
        "https://hovedopgave-mydish-production.up.railway.app/api/recipes",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recipeData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        throw new Error(`Failed to create recipe: ${response.status}`);
      }

      Alert.alert("Success", "Recipe created successfully!");
      setModalVisible(false);
      resetForm();
      fetchRecipes();
    } catch (err) {
      console.error("Error creating recipe:", err);
      Alert.alert("Error", "Failed to create recipe. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    const imageUrl =
      item.images && item.images.length > 0
        ? item.images[0].imageUrl
        : "https://via.placeholder.com/300x200?text=No+Image";

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => handleRecipePress(item.id)}
          activeOpacity={0.7}
        >
          <Image source={{ uri: imageUrl }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.cardAuthor}>by {item.authorName}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.interactionSection}>
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>{item.likeCount} likes</Text>
            <TouchableOpacity onPress={() => openCommentsModal(item.id)}>
              <Text style={styles.statsText}>{item.commentCount} comments</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLikeToggle(item.id)}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  item.likedByCurrentUser && styles.actionButtonTextActive,
                ]}
              >
                {item.likedByCurrentUser ? "❤️" : "🤍"} Like
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openCommentsModal(item.id)}
            >
              <Text style={styles.actionButtonText}>💬 Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1a8fe3" />
          <Text style={styles.loadingText}>Loading recipes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => fetchRecipes()}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>My Dish</Text>
          </View>

          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => router.push("/menu")}
          >
            <Text style={styles.sidebarIcon}>📋</Text>
            <Text style={styles.sidebarText}>Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sidebarItem, styles.sidebarItemActive]}
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
            <View>
              <Text style={styles.headerTitle}>
                {viewMode === "my" ? "My Dishes" : "Explore Dishes"}
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
                    My Dishes
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
                    Explore Dishes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>+ Create Recipe</Text>
            </TouchableOpacity>
          </View>

          {recipes.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                {viewMode === "my"
                  ? "You haven't created any recipes yet"
                  : "No recipes found"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={recipes}
              renderItem={renderRecipeCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.list}
              columnWrapperStyle={styles.row}
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
        visible={commentsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommentsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity
                onPress={() => setCommentsModalVisible(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentsContainer}>
              {loadingComments ? (
                <ActivityIndicator size="large" color="#1a8fe3" />
              ) : comments.length === 0 ? (
                <Text style={styles.noCommentsText}>
                  No comments yet. Be the first to comment!
                </Text>
              ) : (
                comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <View style={styles.profilePicture}>
                        <Text style={styles.profileInitial}>
                          {comment.userName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.commentContent}>
                        <Text style={styles.commentUserName}>
                          {comment.userName}
                        </Text>
                        <Text style={styles.commentText}>
                          {comment.bodyText}
                        </Text>
                        <View style={styles.commentFooter}>
                          <Text style={styles.commentDate}>
                            {new Date(comment.created).toLocaleDateString()}
                          </Text>
                          <TouchableOpacity
                            style={styles.commentLikeButton}
                            onPress={() => handleCommentLikeToggle(comment.id)}
                          >
                            <Text
                              style={[
                                styles.commentLikeText,
                                comment.likedByCurrentUser &&
                                  styles.commentLikeTextActive,
                              ]}
                            >
                              {comment.likedByCurrentUser ? "❤️" : "🤍"}{" "}
                              {comment.likeCount}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a comment..."
                placeholderTextColor="#999"
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!newComment.trim() || postingComment) &&
                    styles.sendButtonDisabled,
                ]}
                onPress={handlePostComment}
                disabled={!newComment.trim() || postingComment}
              >
                {postingComment ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.sendButtonText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Recipe</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Recipe Name *</Text>
              <TextInput
                style={styles.input}
                value={recipeName}
                onChangeText={setRecipeName}
                placeholder="e.g., Spaghetti Carbonara"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={recipeDescription}
                onChangeText={setRecipeDescription}
                placeholder="Describe your recipe..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setEnableComments(!enableComments)}
                >
                  <Text style={styles.checkboxIcon}>
                    {enableComments ? "☑" : "☐"}
                  </Text>
                  <Text style={styles.checkboxLabel}>Enable Comments</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Ingredients *</Text>

              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <View style={styles.ingredientInputs}>
                    <TextInput
                      style={styles.input}
                      value={ingredient.name}
                      onChangeText={(text) =>
                        updateIngredient(index, "name", text)
                      }
                      placeholder="Ingredient name"
                      placeholderTextColor="#999"
                    />

                    <TextInput
                      style={styles.input}
                      value={ingredient.amount}
                      onChangeText={(text) =>
                        updateIngredient(index, "amount", text)
                      }
                      placeholder="Amount"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={styles.input}
                      value={ingredient.unit}
                      onChangeText={(text) =>
                        updateIngredient(index, "unit", text)
                      }
                      placeholder="Unit (e.g., GRAM)"
                      placeholderTextColor="#999"
                    />

                    <TextInput
                      style={styles.input}
                      value={ingredient.averageCookingTime}
                      onChangeText={(text) =>
                        updateIngredient(index, "averageCookingTime", text)
                      }
                      placeholder="Cooking time (min)"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>

                  {ingredients.length > 1 && (
                    <TouchableOpacity
                      style={styles.buttonRemove}
                      onPress={() => removeIngredient(index)}
                    >
                      <Text style={styles.buttonRemoveText}>−</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={addIngredient}
              >
                <Text style={styles.buttonText}>+ Add Ingredient</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>
                Step-by-Step Guide (Optional)
              </Text>

              {steps.map((step, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <View style={styles.ingredientInputs}>
                    <Text style={styles.stepNumber}>Step {index + 1}</Text>
                    <TextInput
                      style={[styles.input, styles.textarea]}
                      value={step}
                      onChangeText={(text) => updateStep(index, text)}
                      placeholder="Describe this step..."
                      placeholderTextColor="#999"
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  {steps.length > 1 && (
                    <TouchableOpacity
                      style={styles.buttonRemove}
                      onPress={() => removeStep(index)}
                    >
                      <Text style={styles.buttonRemoveText}>−</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={addStep}
              >
                <Text style={styles.buttonText}>+ Add Step</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Images (Optional)</Text>

              {imageUrls.map((imageUrl, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <View style={styles.ingredientInputs}>
                    <TextInput
                      style={styles.input}
                      value={imageUrl}
                      onChangeText={(text) => updateImageUrl(index, text)}
                      placeholder="Enter image URL"
                      placeholderTextColor="#999"
                    />
                  </View>

                  {imageUrls.length > 1 && (
                    <TouchableOpacity
                      style={styles.buttonRemove}
                      onPress={() => removeImageUrl(index)}
                    >
                      <Text style={styles.buttonRemoveText}>−</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={addImageUrl}
              >
                <Text style={styles.buttonText}>+ Add Image URL</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, creating && styles.buttonDisabled]}
                onPress={handleCreateRecipe}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Recipe</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OverviewComponent;
