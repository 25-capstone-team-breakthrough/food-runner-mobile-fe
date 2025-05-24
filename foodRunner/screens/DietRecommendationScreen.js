import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomNavigation from "../components/BottomNavigation";
import FoodItem from "../components/FoodItem";
import RefreshButton from "../components/RefreshButton";
import SearchBar from "../components/SearchBar";


const DietRecommendationScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const [allIngredients, setAllIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [favoriteIngredients, setFavoriteIngredients] = useState([]);
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);

    // 저장한 식재료 불러오기
    useEffect(() => {
      const fetchFavorites = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const res = await fetch("http://13.209.199.97:8080/diet/ingredient/pref/load", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error("즐겨찾기 불러오기 실패");
          const data = await res.json();
          // console.log("⭐️ 즐겨찾기 식재료:", data);
          setFavoriteIngredients(data);
        } catch (err) {
          console.error("❌ 즐겨찾기 식재료 불러오기 실패:", err);
        }
      };

      // useEffect(() => {
      //   fetchFavorites(); // 🔄 mount 시에도 호출
      // }, []);

      fetchFavorites();
    }, []);

    // 식단 추천 생성 rec/set
    const fetchRecommendDietSet = async () => {
        try {
          const token = await AsyncStorage.getItem("token"); // 🔐 인증 필요 시 토큰 추가
          // console.log("🔐 저장된 토큰:", token);
          const res = await fetch("http://13.209.199.97:8080/diet/recipe/rec/set", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ 추천식단 생성 서버 에러 상태:", res.status, errorText);
            throw new Error("추천식단 생성 실패");
          }

          console.log(await res.text()); 

        } catch (err) {
          console.error("❌ 추천 식단 생성 에러:", err);
        }
      };
  

    // 식단 추천 불러오기 rec/load
    const fetchRecipes = async () => {
        try {
          const token = await AsyncStorage.getItem("token"); // 🔐 인증 필요 시 토큰 추가
          const res = await fetch("http://13.209.199.97:8080/diet/recipe/rec/load", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error("레시피 불러오기 실패");

          const data = await res.json();
          console.log("✅ 추천 식단 데이터:", data); // 콘솔 출력

          setRecommendedRecipes(data);
        } catch (err) {
          console.error("❌ 추천 식단 불러오기 에러:", err);
        }
      };

    useEffect(() => {
      fetchRecommendDietSet();
      fetchRecipes();
    }, []);

    const breakFastRecipe = recommendedRecipes.filter(item => item.dietType === "breakfast");
    const lunchRecipe = recommendedRecipes.filter(item => item.dietType === "lunch");
    const dinnerRecipe = recommendedRecipes.filter(item => item.dietType === "dinner");
    // console.log("전체 추천 식단 객체: ", recommendedRecipes);
    // console.log("아침 추천 식단 객체: ", breakFastRecipe);
    // console.log("점심 추천 식단 객체: ", lunchRecipe);
    // console.log("저녁 추천 식단 객체: ", dinnerRecipe);


    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} 
        showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
          {/* 검색 바 */}
          <TouchableOpacity onPress={() => navigation.navigate("Ingredient")}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="식재료를 추가해주세요"
              editable={false} // 눌러도 키보드 안뜨게
              pointerEvents="none" // 입력 막고 클릭만 허용
              onPress={() => navigation.navigate("Ingredient")}
            />
          </TouchableOpacity>
          
 
          {/* 이미지 슬라이더 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageSlider}>
            {favoriteIngredients.map((item) => (
              <View key={item.ingredient.ingredientId} style={styles.imageContainer}>
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      const token = await AsyncStorage.getItem("token");

                      const res = await fetch(`http://13.209.199.97:8080/diet/ingredient/pref/delete?pref_id=${item.id}`, {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });

                      const resultText = await res.text();
                      console.log("📡 서버 응답:", res.status, resultText);

                      if (!res.ok) throw new Error("삭제 실패");

                      // 성공 시 프론트에서 삭제 반영
                      setFavoriteIngredients(
                        favoriteIngredients.filter(i => i.id !== item.id)
                      );

                      console.log("✅ 즐겨찾기 삭제 성공:", item.ingredient.ingredientName);
                    } catch (err) {
                      console.error("❌ 즐겨찾기 삭제 실패:", err);
                    }
                  }}
                  style={styles.deleteButton}
                >
                  <Ionicons name="remove-circle" size={30} color="red" />
                </TouchableOpacity>


                <Image
                  source={{ uri: item.ingredient.ingredientImage }}
                  style={styles.image}
                />
                <Text style={styles.imageText}>{item.ingredient.ingredientName}</Text>
              </View>
            ))}
          </ScrollView>


          <RefreshButton onPress={() => {
            fetchRecommendDietSet();
            fetchRecipes();
          }} />

          {/* 추천 식사 항목 */}
          <View style={styles.dietContainer}>
            <View style={styles.headerContents}>

              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>Breakfast</Text>
              </View>
              {breakFastRecipe.slice(0, 2).map((food) => (
                <TouchableOpacity style={styles.mealContainer}
                  key={food.recommendedRecipeId}
                  onPress={() => navigation.navigate("DietRecipe", { recipe: food.recipeData })}
                >
                  <FoodItem recipe={food.recipeData} navigation={navigation}/>
                </TouchableOpacity>
              ))}
              
              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>Lunch</Text>
              </View>
              {lunchRecipe.slice(0, 2).map((food) => (
                <TouchableOpacity style={styles.mealContainer}
                  key={food.recommendedRecipeId}
                  onPress={() => navigation.navigate("DietRecipe", { recipe: food.recipeData })}
                >
                  <FoodItem recipe={food.recipeData} navigation={navigation}/>
                </TouchableOpacity>
              ))}

              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>Dinner</Text>
              </View>
              {dinnerRecipe.slice(0, 2).map((food) => (
                <TouchableOpacity style={styles.mealContainer}
                  key={food.recommendedRecipeId}
                  onPress={() => navigation.navigate("DietRecipe", { recipe: food.recipeData })}
                >
                  <FoodItem recipe={food.recipeData} navigation={navigation}/>
                </TouchableOpacity>
              ))}


            </View>
          </View>
        </ScrollView>

        <BottomNavigation />
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 50,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 40,
    marginBottom: 15,
  },
  imageSlider: {
    width: "90%",
    marginTop: 10,
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginHorizontal: 0,
    padding: 10,
    position: "relative",
  },
  image: {
    width: 120,
    height: 110,
    borderRadius: 30,
  },
  imageText: {
    fontSize: 15,
    color: '#7E7B7B',
    marginTop: 5,
    fontWeight: "300",
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 25,
    padding: 13,
    zIndex: 1,
    transform: [{ scale: 0.6 }], 
  },
  mealTitle: {
    fontSize: 25,
    fontWeight: "500",
    marginTop: 40,
    marginLeft: 20,
  },
  dietContainer: {
    marginTop: -50,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 30,
    width: 340,
    height: 75,
    marginTop: -20,
    marginBottom: 10,
  },
  mealContainer: {
    borderRadius: 60,
  },
});

export default DietRecommendationScreen;