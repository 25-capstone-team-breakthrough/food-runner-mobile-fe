import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import BottomNavigation from "../components/BottomNavigation";

const screenWidth = Dimensions.get("window").width;

const NutritionMainScreen = () => {
  const dailyCalories = 2000;
  const consumedCalories = 1800;
  const progress = consumedCalories / dailyCalories;

  const chartData = {
    data: [progress],
  };

  const nutrients = [
    { name: "탄수화물", status: "충분", amount: "100g", color: "green" },
    { name: "단백질", status: "부족", amount: "10g", color: "red" },
    { name: "지방", status: "부족", amount: "0g", color: "gray" },
  ];

  const meals = [
    { id: 1, name: "스파게티", image: require("../assets/logo.png") },
  ];

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F8F8F8" }}>
      {/* 날짜 선택 */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>2025.01.21</Text>
      </View>

      {/* 칼로리 Progress Chart */}
      <View style={{ alignItems: "center" }}>
        <ProgressChart
          data={chartData}
          width={screenWidth * 0.6}
          height={150}
          strokeWidth={10}
          radius={50}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
          }}
          hideLegend={true}
        />
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>{consumedCalories}</Text>
        <Text style={{ color: "gray" }}>권장 {dailyCalories}kcal</Text>
      </View>

      {/* 3대 주요 영양소 */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
        {nutrients.map((item, index) => (
          <View key={index} style={{ alignItems: "center" }}>
            <Text style={{ color: item.color, fontWeight: "bold" }}>{item.status}</Text>
            <Text>{item.amount}</Text>
            <Text>{item.name}</Text>
          </View>
        ))}
      </View>

      {/* 식사 목록 */}
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <View style={{ alignItems: "center", margin: 10 }}>
            <Image source={item.image} style={{ width: 80, height: 80, borderRadius: 10 }} />
            <Text>{item.name}</Text>
          </View>
        )}
      />
      <BottomNavigation />
    </View>
  );
};

export default NutritionMainScreen;