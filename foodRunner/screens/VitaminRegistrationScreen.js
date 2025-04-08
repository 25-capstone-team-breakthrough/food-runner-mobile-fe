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

const supplementItems = [
  {
    id: 1,
    name: "알티지 오메가",
    brand: "종근당",
    nutrients: "오메가 3, 비타민 D",
    image: require("../assets/omega.png"),
  },
  {
    id: 2,
    name: "종근당 비타민C 1000",
    brand: "종근당",
    nutrients: "비타민 C",
    image: require("../assets/vitamin.png"),
  }
];

const FoodSearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedsupplementItem, setSelectedsupplementItem] = useState(null);

  // 🔹 검색어 변경 시 필터링
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const results = supplementItems.filter((item) =>
        item.name.includes(text) || item.brand.includes(text)
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

      {/* 🔹 검색 결과 리스트 */}
      {/* <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text>{item.name}</Text>
          </View>
        )}
      /> */}

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
                  if (selectedsupplementItem?.id === item.id) {
                    setSelectedsupplementItem(null);
                  } else {
                    setSelectedsupplementItem(item);
                  }
                }}
                style={[
                  styles.resultItem,
                  selectedsupplementItem?.id === item.id && styles.selectedsupplementItem,
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={item.image} style={styles.itemImage} />
                  <View style={styles.threeText}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemBrand}>{item.brand}</Text>
                    <Text style={styles.itemNutrient}>{item.nutrients}</Text>
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
          if (selectedsupplementItem) {
            navigation.navigate("NutritionMain", { selectedsupplementItem });
          } else {
            alert("영양제를 선택해주세요!");
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
  selectedsupplementItem: {
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
  itemNutrient: {
    fontSize: 14,
    color: "#898989",
    marginTop: 4,
  },
};

export default FoodSearchScreen;
