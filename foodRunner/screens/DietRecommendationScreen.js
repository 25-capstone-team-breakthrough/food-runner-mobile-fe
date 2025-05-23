import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
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

    // 검색어 입력 시 호출될 검색 함수
    // const fetchIngredients = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem("token");
    //     const response = await fetch("http://13.209.199.97:8080/diet/ingredient/data/load", {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });

    //     if (!response.ok) throw new Error("식재료 불러오기 실패");
    //     const data = await response.json();
    //     // console.log(data)
    //     setAllIngredients(data);
    //     console.log(data);
    //   } catch (err) {
    //     console.error("❌ 식재료 불러오기 실패:", err);
    //   }
    // };

    // useEffect(() => {
    //   fetchIngredients();
    // }, []);

    // 검색어가 바뀔 때마다 필터링
    // useEffect(() => {
    //   const lower = search.toLowerCase();
    //   const filtered = allIngredients.filter((item) =>
    //     item.name?.toLowerCase().includes(lower)
    //   );
    //   setFilteredIngredients(filtered);
    // }, [search, allIngredients]);

    const [images, setImages] = useState([
      { id: "1", name: "banana", src: require("../assets/banana.png") },
      { id: "2", name: "banana", src: require("../assets/banana.png") },
      { id: "3", name: "banana", src: require("../assets/banana.png") },
      { id: "4", name: "banana", src: require("../assets/banana.png") },
      { id: "5", name: "banana", src: require("../assets/banana.png") },
      { id: "6", name: "banana", src: require("../assets/banana.png") },
    ]);

    const handleDelete = (id) => {
      setImages(images.filter((image) => image.id !== id));
    };

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
            />
          </TouchableOpacity>
 
          {/* 이미지 슬라이더 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageSlider}>
            {images.map((image) => (
              <View key={image.id} style={styles.imageContainer}>
                <TouchableOpacity onPress={() => handleDelete(image.id)} style={styles.deleteButton}>
                  <Ionicons name="remove-circle" size={30} color="red" />
                </TouchableOpacity>
                <Image source={image.src} style={styles.image} />
                <Text style={styles.imageText}>{image.name}</Text>
              </View>
            ))}
          </ScrollView>

          <RefreshButton onPress={() => console.log("새로고침 버튼 클릭됨!")} />

          {filteredIngredients.length > 0 && (
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
          )}

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
                    key={food.id}
                    onPress={() => navigation.navigate("DietRecipe", { recipe: food })}
                  >
                    <FoodItem food={food} />
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