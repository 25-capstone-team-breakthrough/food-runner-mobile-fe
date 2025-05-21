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
    useEffect(() => {
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

          
          // const res = await fetch(...);
          console.log(await res.text()); 

          // const data = await res.json();
          // console.log("✅ 추천 식단 생성 데이터:", data); // 콘솔 출력

          // setRecommendedRecipes(data);
        } catch (err) {
          console.error("❌ 추천 식단 생성 에러:", err);
        }
      };

      fetchRecommendDietSet();
    }, []);

    // 식단 추천 불러오기 rec/load
    useEffect(() => {
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

      fetchRecipes();
    }, []);

    
    // 레시피 불러오기
    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const res = await fetch("http://13.209.199.97:8080/diet/recipe/data/load");
          if (!res.ok) throw new Error("레시피 불러오기 실패");
          const data = await res.json();
          // console.log("🍽 전체 레시피 데이터:", data);

          // 👉 필드 변환 없이 통째로 저장
          setRecommendedRecipes(data);
        } catch (err) {
          console.error("❌ 레시피 불러오기 에러:", err);
        }
      };

      fetchRecipes();
    }, []);


    // 타입별로 추천 식단 분류
  // const groupedRecipes = {
  //   Breakfast: recommendedRecipes.filter(r => r.recipeType === "BREAKFAST"),
  //   Lunch: recommendedRecipes.filter(r => r.recipeType === "LUNCH"),
  //   Dinner: recommendedRecipes.filter(r => r.recipeType === "DINNER"),
  // };



    const recommendedMeals = {
        Breakfast: [
            { id: "1", name: "바나나 한 조각", calories: "31kcal 당 100g", image: require("../assets/banana.png") },
            { id: "2", name: "프로틴 쉐이크", calories: "102kcal 당 100ml", image: require("../assets/logo.png") },
        ],
        Lunch: [
            { id: "3", name: "닭 가슴살", calories: "239kcal 당 100g", image: require("../assets/logo.png") },
            { id: "4", name: "삶은 계란", calories: "155kcal 당 100ml", image: require("../assets/logo.png") },
        ],
        Dinner: [
            { id: "5", name: "고구마", calories: "86kcal 당 100g", image: require("../assets/logo.png") },
            { id: "6", name: "연어 스테이크", calories: "208kcal 당 100g", image: require("../assets/logo.png") },
        ],
    };

    // console.log("📄 groupedRecipes:", groupedRecipes);

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


          <RefreshButton onPress={() => console.log("새로고침 버튼 클릭됨!")} />

          {/* {filteredIngredients.length > 0 && (
            <View style={{ width: "90%", marginTop: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 10 }}>검색 결과</Text>
              {filteredIngredients.map((ingredient) => (
                <TouchableOpacity
                  key={ingredient.id}
                  onPress={() => {
                    console.log("선택된 식재료:", ingredient.name);
                    // 필요한 경우 여기에 이미지 추가, 또는 저장 호출
                  }}
                  style={{
                    backgroundColor: "#f1f1f1",
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 5,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{ingredient.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )} */}

          {/* 추천 식사 항목 */}
          <View style={styles.dietContainer}>
            {Object.entries(recommendedMeals).map(([mealType, foods]) => (
              <View key={mealType}>
                <View style={styles.headerContents}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>{mealType}</Text>
                </View>
                {foods.map((food) => (
                  <TouchableOpacity style={styles.mealContainer}
                    key={food.recipeId}
                    onPress={() => navigation.navigate("DietRecipe", { recipe: food })}
                  >
                    <FoodItem recipe={food} />
                  </TouchableOpacity>
                ))}
                </View>
            </View>
          ))}
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