import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
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
  const [searchText, setSearchText] = useState(""); // 사용자가 입력한 검색 텍스트
  const [filteredItems, setFilteredItems] = useState([]); // 검색 결과 음식 리스트
  const [selectedItem, setSelectedItem] = useState(null); // 사용자가 선택한 음식 객체
  const [foodItems, setFoodItems] = useState([]); // 전체 음식 데이터
  const [favoriteItems, setFavoriteItems] = useState([]); // 즐겨찾기된 음식들의 foodId 리스트
  const [favoriteFoodData, setFavoriteFoodData] = useState([]); //즐겨찾기된 음식의 전체 데이터 배열
  const route = useRoute();
  const selectedDate = route.params?.selectedDate; 
  console.log("받은 날짜:", selectedDate);

  // 즐겨찾기 등록 api
  const toggleFavorite = async (item) => {
    
    const token = await AsyncStorage.getItem("token");
    const isFavorited = favoriteItems.includes(item.foodId);
    try {
      if (isFavorited) {
        // 삭제
        const deleteRes = await fetch(
          `http://13.209.199.97:8080/diet/food/pref/delete?pref_id=${item.prefId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!deleteRes.ok) throw new Error("삭제 실패");

        setFavoriteItems((prev) => prev.filter((id) => id !== item.foodId));
        setFavoriteFoodData((prev) => prev.filter((food) => food.foodId !== item.foodId));
        console.log("⭐️ 즐겨찾기 삭제 성공:", item.foodName);
      } else {
        // 등록
        const saveRes = await fetch(
          `http://13.209.199.97:8080/diet/food/pref/save?food_id=${item.foodId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!saveRes.ok) throw new Error("등록 실패");

        setFavoriteItems((prev) => [...prev, item.foodId]);
        console.log("⭐️ 즐겨찾기 등록 성공:", item.foodName);
      }

      await fetchFavorites(); // 동기화용
    } catch (err) {
      console.error("❌ 즐겨찾기 처리 오류:", err);
    }
  };



  // 즐겨찾기 불러오기 api
  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://13.209.199.97:8080/diet/food/pref/load", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setFavoriteItems(data.map((item) => item.food.foodId));
      setFavoriteFoodData(data.map((item) => ({
        ...item.food,
        prefId: item.id,
      })));


      console.log("[📦 즐겨찾기 데이터]", data);

    } catch (err) {
      console.error("❌ 즐겨찾기 로드 실패:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchFoods();
      await fetchFavorites(); // 반드시 함께 호출!
    };

    fetchAll();
  }, []);


  // 음식 데이터 검색시 로드
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

  const visibleList = searchText.length > 0 ? filteredItems : favoriteFoodData;


  return (
    <SafeAreaView style={styles.container}>           
      {/* 🔹 검색창 */}
      <View style={styles.searchBar}>
        <SearchBar value={searchText} onChangeText={handleSearch} 
          placeholder="제품명/브랜드명" 
        />
      </View>

        <View style={{ flex: 1 }}>
          {/* 검색어 있을 경우에만 검색 결과 개수 출력 */}
          {searchText.length > 0 && (
            <Text style={styles.searchMountText}>
              검색결과 {filteredItems.length}개
            </Text>
          )}

          <FlatList
            data={searchText.length > 0 ? filteredItems : favoriteFoodData}
            keyExtractor={(item) => item.foodId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setSelectedItem(selectedItem?.foodId === item.foodId ? null : item)
                  // console.log("선택된 아이템", selectedItem)
                }
                style={[
                  styles.resultItem,
                  selectedItem?.foodId === item.foodId && styles.selectedItem,
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(item)}
                    style={styles.favoriteButton}
                  >
                    <Ionicons
                      name={favoriteItems.includes(item.foodId) ? "star" : "star-outline"}
                      size={24}
                      color={favoriteItems.includes(item.foodId) ? "#E1FF01" : "#C0C0C0"}
                    />
                  </TouchableOpacity>
                  <Image source={{ uri: item.foodImage }} style={styles.itemImage} />
                  <View style={styles.threeText}>
                    {/* <Text style={styles.itemName}>{item.foodName}</Text> */}
                    <Text style={styles.itemName}>
                      {item.foodName.length > 10
                        ? `${item.foodName.substring(0, 10)}...`
                        : item.foodName}
                    </Text>
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
            ListEmptyComponent={
              <Text style={styles.searchMountText}>
                {searchText.length > 0 ? "검색 결과가 없습니다" : "즐겨찾기된 음식이 없습니다"}
              </Text>
            }
          />
        </View>

      <RegisterButton
        style={{ bottom: 90 }}
        onPress={async () => {
          if (!selectedItem) {
            alert("음식을 선택해주세요!");
            return;
          }

          try {
            const token = await AsyncStorage.getItem("token");
            console.log("토큰확인", token)

            const response = await fetch("http://13.209.199.97:8080/diet/meal/log/save", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "search", 
                foodId: selectedItem.foodId,
                // mealImage: "http://image-url-from-s3",
                mealImage: "",
                dateTime: `${selectedDate}T12:00:00`,
              }),
            });
            console.log("선택된 아이템:", selectedItem);
            console.log("보내는 foodId:", selectedItem?.foodId);
            console.log("식사 등록 시간: ", selectedDate);

            if (!response.ok) {
              throw new Error(`서버 오류: ${response.status}`);
            }

            alert("✅ 식사 기록이 저장되었습니다.");

            navigation.navigate("NutritionMain");
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
