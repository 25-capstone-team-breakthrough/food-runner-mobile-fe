import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavigation from "../components/BottomNavigation";
import RegisterButton from "../components/RegisterButton";
import SearchBar from "../components/SearchBar";

// const foodItems = [
//   {
//     id: 1,
//     name: "빅맥버거",
//     brand: "맥도날드",
//     kcal: 889,
//     image: require("../assets/bigmac.png"),
//   },
//   {
//     id: 2,
//     name: "불고기버거",
//     brand: "롯데리아",
//     kcal: 489,
//     image: require("../assets/bulgogi.png"),
//   },
//   {
//     id: 3,
//     name: "쉑쉑버거",
//     brand: "쉑쉑",
//     kcal: 1089,
//     image: require("../assets/shakeshack.png"),
//   },
//   {
//     id: 4,
//     name: "빅맥버거",
//     brand: "맥도날드",
//     kcal: 889,
//     image: require("../assets/bigmac.png"),
//   },
//   {
//     id: 5,
//     name: "빅맥버거",
//     brand: "맥도날드",
//     kcal: 889,
//     image: require("../assets/bigmac.png"),
//   },
//   {
//     id: 6,
//     name: "빅맥버거",
//     brand: "맥도날드",
//     kcal: 889,
//     image: require("../assets/bigmac.png"),
//   },
//   {
//     id: 7,
//     name: "빅맥버거",
//     brand: "맥도날드",
//     kcal: 889,
//     image: require("../assets/bigmac.png"),
//   },
//   {
//     id: 8,
//     name: "빅맥버거",
//     brand: "맥도날드",
//     kcal: 889,
//     image: require("../assets/bigmac.png"),
//   },
// ];

// useEffect(() => {
//   const fetchFoods = async () => {
//     try {
//       const res = await fetch(`http://<YOUR_BACKEND_HOST>:8080/api/data/foods`);
//       const data = await res.json();
//       setFoodItems(data); // FoodDataResponse DTO 리스트
//     } catch (err) {
//       console.error("음식 데이터 로딩 실패:", err);
//     }
//   };

//   fetchFoods();
// }, []);


const FoodSearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [foodItems, setFoodItems] = useState([]);

  // ✅ API 호출 - 백엔드에서 음식 목록 가져오기
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // 저장된 토큰 가져오기
        console.log("불러온 토큰:", token);
  
        const res = await fetch("http://ec2-13-125-232-235.ap-northeast-2.compute.amazonaws.com:8080/api/data/foods", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("응답 상태:", res.status);
        if (!res.ok) {
          throw new Error(`서버 응답 오류: ${res.status}`);
        }
  
        const data = await res.json();
        // console.log("받아 온 데이터:", data);
        setFoodItems(data);
      } catch (err) {
        console.error("❌ 음식 데이터 로딩 실패:", err);
      }
    };
    
  
    fetchFoods();
  }, []);

  // 🔹 검색어 변경 시 필터링
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const results = foodItems.filter((item) =>
        item.foodName.includes(text) || (item.foodCompany?.includes?.(text))
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
            keyExtractor={(item) => item.foodId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
              onPress={() => {
                setSelectedItem(selectedItem?.foodId === item.foodId ? null : item);
              }}
              style={[
                styles.resultItem,
                selectedItem?.foodId === item.foodId && styles.selectedItem,
              ]}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={{ uri: item.foodImage }} style={styles.itemImage} />
                  <View style={styles.threeText}>
                    <Text style={styles.itemName}>{item.foodName}</Text>
                    <Text style={styles.itemBrand}>{item.foodCompany}</Text>
                    <Text style={styles.itemKcal}>{item.calories} kcal</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ 
              paddingHorizontal: 30,
              paddingBottom: 105,
             }}
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
            navigation.navigate("NutritionMain", {
              selectedItem: {
                name: selectedItem.foodName,
                kcal: selectedItem.calories,
                image: { uri: selectedItem.foodImage },
              },
            });
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
