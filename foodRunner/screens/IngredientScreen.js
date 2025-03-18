import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";
import RefreshButton from "../components/RefreshButton";
import RegisterButton from "../components/RegisterButton";

export default function IngredientScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [ingredients, setIngredients] = useState([
    "바나나",
    "프로틴 쉐이크",
    "삶은 달걀",
    "고등어",
    "양배추",
    "시금치",
    "사과",
    "두부",
    "삶은 달걀",
    "고등어",
    "양배추",
    "시금치",
    "사과",
    "두부",
  ]);

  // ✅ 개별 버튼의 상태를 저장하는 배열
  const [pressedStates, setPressedStates] = useState(
    new Array(ingredients.length).fill(false) // 모든 버튼의 초기값 false
  );

  // ✅ 특정 버튼을 클릭하면 상태를 토글 (true ↔ false)
  const handlePress = (index) => {
    const newStates = [...pressedStates]; // 기존 배열 복사
    newStates[index] = !newStates[index]; // 현재 버튼의 상태 변경
    setPressedStates(newStates); // 상태 업데이트
  };

  return (
    <View style={styles.container}>
      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#4E4D4D" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="선호 식재료를 추가해주세요"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <RefreshButton onPress={() => console.log("새로고침 버튼 클릭됨!")} />

      <Text style={styles.subTitle}>추천재료</Text>

      {/* 추천 식재료 리스트 */}
      <FlatList
        data={ingredients}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // 2열 배치
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.ingredientButton, pressedStates[index] && styles.pressedEffect]} // ✅ 상태에 따라 스타일 변경
            onPress={() => handlePress(index)}
          >
            <Text style={styles.ingredientText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 등록하기 버튼 */}
      <RegisterButton onPress={() => navigation.navigate("DietRecommendation")} />

      {/* 하단 네비게이션 바 */}
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    width: "90%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 5,
    marginBottom: 10,
    height: 50,
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  subTitle: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginLeft: "13%",
    marginTop: -10,
  },
  row: {
    justifyContent: "space-between",
    width: "90%",
  },
  listContainer: {
    marginTop: 10,
  },
  ingredientButton: {
    backgroundColor: "#fff",
    width: 165,
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30, 
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  pressedEffect: {
    backgroundColor: "#EEEDED",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },
  ingredientText: {
    fontSize: 20,
    color: "#000",
  },
  registerButton: {
    backgroundColor: "#E1FF01",
    width: 330,
    height: 60,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  registerText: {
    fontSize: 25,
    color: "#000",
    alignSelf: "center",
    paddingTop: 5,
  },
});