import { View, Text,ScrollView, TouchableOpacity} from "react-native";
import { homeStyles } from "../../assets/styles/home.styles";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { MealAPI } from "../../services/mealAPI";
import LoadingSpinner from "../../components/LoadingSpinner";


const HomeScreen = () => {

  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


const loadData = async () => {
    try {

      const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal(),
      ]);

       const transformedCategories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

       setCategories(transformedCategories);
        if (!selectedCategory) setSelectedCategory(transformedCategories[0].name);

      const transformedMeals = randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);

      setRecipes(transformedMeals);

      const transformedFeatured = MealAPI.transformMealData(featuredMeal);
      setFeaturedRecipe(transformedFeatured);
    }
    catch(error)
    {
        console.log("Error loading the data", error);
    }
    finally{
        setLoading(false);
    }
  };

   const loadCategoryData = async (category) => {
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.error("Error loading category data:", error);
      setRecipes([]);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };

   useEffect(() => {
    loadData();
  }, []);

  if (loading && !refreshing) return <LoadingSpinner message="Loading delicions recipes..." />;

 return (

  <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContent}
      >

    {/* Animal Icons */}
     <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/lamb.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />

             <Image
            source={require("../../assets/images/chicken.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />

            <Image
            source={require("../../assets/images/pork.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
    </View>


     {/* Featured Section */}

     {featuredRecipe && <View style = {homeStyles.featuredSection}>
      
      <TouchableOpacity style ={homeStyles.featuredSection}
      activeOpacity={0.9}
      onPress={()=> router.push(`/recipe/${featuredRecipe.id}`)}
      >

       <View style ={homeStyles.featuredImageContainer}>
        <Image source={{uri :featuredRecipe.image}}
        style ={homeStyles.featuredImage}
        contentFit="cover"
        transition={500}
        >
        </Image>
       </View>
        <View style ={ homeStyles.featuredOverlay}>
           <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
        </View>

         <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {featuredRecipe.title}
                    </Text>
       </View>
     </View>
      </TouchableOpacity>
      </View>}



     
      </ScrollView>
 
      </View>
     );
};

export default HomeScreen;