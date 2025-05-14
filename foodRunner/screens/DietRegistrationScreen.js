import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
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


const FoodSearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [foodItems, setFoodItems] = useState([]);


  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // 저장된 토큰 가져오기
        console.log("불러온 토큰:", token);

        const res = await fetch("http://13.209.199.97:8080/diet/food/data/load", {
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
        setFoodItems(data);
        console.log("음식데이터 가져오기 성공");
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
                    {item.foodCompany !== "해당없음" && (
                      <Text style={styles.itemBrand}>{item.foodCompany}</Text>
                    )}
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

      <RegisterButton
        onPress={async () => {
          if (!selectedItem) {
            alert("음식을 선택해주세요!");
            return;
          }

          try {
            const token = await AsyncStorage.getItem("token");
            console.log(token)

            const response = await fetch("http://13.209.199.97:8080/diet/meal/log/save", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "search", // 또는 LUNCH, DINNER, SNACK 등 사용자가 선택
                mealImage: "http://image-url-from-s3", // 현재는 빈 문자열 또는 테스트용 URL로 넣어도 됨
                foodId: selectedItem.foodId,
                dateTime: new Date().toISOString(),
              }),
            });

            if (!response.ok) {
              throw new Error(`서버 오류: ${response.status}`);
            }

            alert("✅ 식사 기록이 저장되었습니다.");

            navigation.navigate("NutritionMain"
            //   , {
            //   selectedItem: {
            //     name: selectedItem.foodName,
            //     kcal: selectedItem.calories,
            //     image: { uri: selectedItem.foodImage },
            //   },
            // }
          );
          } catch (err) {
            console.error("❌ 식사 기록 저장 실패:", err);
            alert("식사 기록 저장에 실패했습니다.");
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
