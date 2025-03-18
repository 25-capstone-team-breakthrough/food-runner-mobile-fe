import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import FoodItem from "../components/FoodItem";
import BottomNavigation from "../components/BottomNavigation";
import SearchBar from "../components/SearchBar";
import RefreshButton from "../components/RefreshButton";

const DietRecommendationScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");

    // 하드코딩된 추천 식단 데이터 (백엔드 없이 UI 테스트 가능)
    const recommendedMeals = {
        Breakfast: [
            { id: "1", name: "바나나 한 조각", calories: "31kcal 당 100g", image: require("../assets/logo.png") },
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
      <View style={styles.container}>
        {/* 검색 바 */}
        <SearchBar value={search} onChangeText={setSearch} 
          placeholder="식재료를 추가해주세요"
        />

        {/* 스크롤 가능하게 수정 */}
        <ScrollView>
          {Object.entries(recommendedMeals).map(([mealType, foods]) => (
            <View key={mealType}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>{mealType}</Text>
                <RefreshButton onPress={() => console.log("새로고침 버튼 클릭됨!")} />  
              </View>
              {foods.map((food) => (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => navigation.navigate("DietRecipe", { recipe: food })}
                >
                  <FoodItem food={food} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        <BottomNavigation />
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      paddingTop: 50,
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
    mealHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: 340,
      height: 75,
      marginTop: 20,
      marginBottom: 10,
    },
    mealTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
});

export default DietRecommendationScreen;
