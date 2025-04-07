import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RegisterButton from "../components/RegisterButton";
import SearchBar from "../components/SearchBar";
import BottomNavigation from "../components/BottomNavigation";

const foodItems = [
  {
    id: 1,
    name: "빅맥버거",
    brand: "맥도날드",
    kcal: 889,
    image: require("../assets/bigmac.png"),
  },
  {
    id: 2,
    name: "불고기버거",
    brand: "롯데리아",
    kcal: 489,
    image: require("../assets/bulgogi.png"),
  },
  {
    id: 3,
    name: "쉑쉑버거",
    brand: "쉑쉑",
    kcal: 1089,
    image: require("../assets/shakeshack.png"),
  },
  {
    id: 4,
    name: "빅맥버거",
    brand: "맥도날드",
    kcal: 889,
    image: require("../assets/bigmac.png"),
  },
  {
    id: 5,
    name: "빅맥버거",
    brand: "맥도날드",
    kcal: 889,
    image: require("../assets/bigmac.png"),
  },
  {
    id: 6,
    name: "빅맥버거",
    brand: "맥도날드",
    kcal: 889,
    image: require("../assets/bigmac.png"),
  },
  {
    id: 7,
    name: "빅맥버거",
    brand: "맥도날드",
    kcal: 889,
    image: require("../assets/bigmac.png"),
  },
  {
    id: 8,
    name: "빅맥버거",
    brand: "맥도날드",
    kcal: 889,
    image: require("../assets/bigmac.png"),
  },
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
      <View style={styles.searchBar}>
        <SearchBar value={searchText} onChangeText={handleSearch} 
          placeholder="제품명/브랜드명" 
        />
      </View>

      <Text style={styles.searchMountText}>조회결과 124개</Text>

      {/* 🔹 검색 결과 리스트 */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={item.image}
                style={styles.itemImage}
              />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                <Text style={styles.itemKcal}>{item.kcal} kcal</Text>
              </View>
            </View>
            <View style={styles.separator}></View>
          </View>
        )}
        
        contentContainerStyle={{ paddingHorizontal: 30 }}
      />

      {/* 🔹 등록하기 버튼 */}
      <RegisterButton onPress={() => navigation.goBack()} />

      <BottomNavigation />
    </SafeAreaView>
  );
};



const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    alignItems: "center",
  },
  searchMountText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 40, 
  },
  resultItem: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginLeft: 20,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  itemBrand: {
    fontSize: 16,
    color: "#898989",
    marginTop: 4,
  },
  itemKcal: {
    fontSize: 14,
    color: "#898989",
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
    marginHorizontal: 10,
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
