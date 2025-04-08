import React, { useState } from "react";
import {
  View,
  Text,
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
  const [selectedItem, setSelectedItem] = useState(null);


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

        {filteredItems.length > 0 ? (
        <>
          <Text style={styles.searchMountText}>
            검색결과 {filteredItems.length}개
          </Text>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (selectedItem?.id === item.id) {
                    setSelectedItem(null);
                  } else {
                    setSelectedItem(item);
                  }
                }}
                style={[
                  styles.resultItem,
                  selectedItem?.id === item.id && styles.selectedItem,
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={item.image} style={styles.itemImage} />
                  <View style={styles.threeText}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemBrand}>{item.brand}</Text>
                    <Text style={styles.itemKcal}>{item.kcal} kcal</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 30 }}
          />
        </>
      ) : (
        searchText.length > 0 && (
          <Text style={styles.searchMountText}>검색 결과가 없습니다</Text>
        )
      )}


      {/* 🔹 등록하기 버튼 */}
      <RegisterButton
        onPress={() => {
          if (selectedItem) {
            navigation.navigate("NutritionMain", { selectedItem });
          } else {
            alert("음식을 선택해주세요!");
          }
        }}
      />
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
    borderRadius: 3,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedItem: {
    backgroundColor: "rgba(217, 217, 217, 0.4)",
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginLeft: 20,
  },
  threeText: {
    marginLeft: 15,
    gap: 5,
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
};

export default FoodSearchScreen;
