import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const foodItems = [
  { id: 1, name: "사과" },
  { id: 2, name: "바나나" },
  { id: 3, name: "오렌지" },
  { id: 4, name: "김치" },
  { id: 5, name: "된장찌개" },
];

const FoodSearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  // 🔹 검색어 변경 시 필터링
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const results = foodItems.filter((item) =>
        item.name.includes(text)
      );
      setFilteredItems(results);
    } else {
      setFilteredItems([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 검색창 */}
      <TextInput
        style={styles.searchInput}
        placeholder="음식을 검색하세요..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* 🔹 검색 결과 리스트 */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text>{item.name}</Text>
          </View>
        )}
      />

      {/* 🔹 등록하기 버튼 */}
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.goBack()}>
        <Text style={{ color: "white", fontWeight: "bold" }}>등록하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F8F8",
  },
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  resultItem: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: "#3498db",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
};

export default FoodSearchScreen;
