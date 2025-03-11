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
  ]);

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

      {/* 추천 식재료 타이틀 */}
      <TouchableOpacity>
          <Ionicons name="refresh" size={22} color="#000" />
      </TouchableOpacity>
      <Text style={styles.subTitle}>추천재료</Text>

      {/* 추천 식재료 리스트 */}
      <FlatList
        data={ingredients}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // 2열 배치
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.ingredientButton}>
            <Text style={styles.ingredientText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 등록하기 버튼 */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>등록하기</Text>
      </TouchableOpacity>

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
    paddingVertical: 15,  // 기존보다 padding 증가
    paddingHorizontal: 10,
    borderRadius: 50,
    marginBottom: 10,
    height: 50,  // 기존보다 높이 증가 (예: 50 → 55)
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
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginBottom: 10,
  },
  row: {
    justifyContent: "space-between",
    width: "90%",
  },
  ingredientButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  ingredientText: {
    fontSize: 16,
    color: "#000",
  },
  registerButton: {
    backgroundColor: "#C8FF00",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  registerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
});
