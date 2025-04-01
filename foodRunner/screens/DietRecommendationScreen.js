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
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} 
        showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
          {/* 검색 바 */}
          <SearchBar value={search} onChangeText={setSearch} placeholder="식재료를 추가해주세요" />
 
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
    paddingHorizontal: 0,
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
  // headerContents: {
  //   marginTop: -10,
  // },
  mealTitle: {
    fontSize: 25,
    fontWeight: "500",
    marginTop: 40,
    marginLeft: 20,
  },
  dietContainer: {
    marginTop: -80,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 30,
    width: 340,
    height: 75,
    marginTop: 10,
    marginBottom: 10,
  },
  mealContainer: {
    borderRadius: 30,
  },
});

export default DietRecommendationScreen;
