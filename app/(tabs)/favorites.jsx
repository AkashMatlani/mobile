import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import {
  favoritesStyles,
  favourites,
} from "../../assets/styles/favorites.style";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import LoadingSpinner from "../../components/LoadingSpinner";

const FavoriteScreen = () => {
  const { signOut } = useClerk();

  const { user } = useUser();

  const [FavoriteRecipe, setFavouireRecipe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch(`${API_URL}/favorites/${user.id}`);

        if (!response.ok) throw new Error("Failed to fetch favorites");

        const favorites = await response.json();

        //transform the data to match the redipecard componet to expectted fromat

        const transfrommedFavorites = favorites.map((favorite) => ({
          ...favorite,
          id: favorite.recipeId,
        }));

        setFavouireRecipe(transfrommedFavorites);
      } catch (error) {
        console.log("Error loading favorites", error);
        Alert.alert("Error", "Failed to laod favorites");
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user.id]);

  const handleSignout = (async) => {

    Alert.alert("Logout", "Are you sure want to Loagout?",[
      {text:"Cancel",style: "cancel"},
      {text: "Logout",style: "destructive", onPress: signOut}
    ])
  };
  if (loading) return <LoadingSpinner message= "Loading your Favorites"></LoadingSpinner>

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity
            style={favoritesStyles.logoutButton}
            onPress={handleSignout}
          >
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={FavoriteRecipe}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={NoFavoritesFound}
          ></FlatList>
        </View>
      </ScrollView>
    </View>
  );
};

export default FavoriteScreen;
