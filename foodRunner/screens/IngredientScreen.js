import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import BottomNavigation from "../components/BottomNavigation";
import RefreshButton from "../components/RefreshButton";
import RegisterButton from "../components/RegisterButton";
import SearchBar from "../components/SearchBar";

export default function IngredientScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [ingredients, setIngredients] = useState([]); // 추천 식재료
  const [filteredItems, setFilteredItems] = useState([]); // 검색 결과
  const [selectedItem, setSelectedItem] = useState(null);
  const [pressedStates, setPressedStates] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (search.trim().length === 0) {
          setFilteredItems([]);
          return;
        }

        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://13.209.199.97:8080/diet/ingredient/data/load", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const text = await res.text();
        if (!res.ok || !text) throw new Error("검색 응답 오류 또는 빈 응답");

        const data = JSON.parse(text);
        const filtered = data.filter((item) => {
          const name = item.foodName || item.ingredientName || "";
          return name.toLowerCase().includes(search.toLowerCase());
        });

        setFilteredItems(filtered);
      } catch (err) {
        console.error("❌ 검색 실패:", err);
      }
    };

    fetchSearchResults();
  }, [search]);

  // 추천 식재료 불러오기 (처음 로딩 + 검색어가 없을 때만)
  // 불러오기만
  const fetchRecommendedIngredients = useCallback(async () => {
    try {
      console.log("📡 추천 식재료 가져오는 중...");
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://13.209.199.97:8080/diet/ingredient/rec/load", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();
      // console.log("🧾 응답 텍스트:", text);
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error("데이터 형식 오류");
      setIngredients(data);
      setPressedStates(new Array(data.length).fill(false));
    } catch (err) {
      console.error("❌ 추천 식재료 불러오기 실패:", err);
    }
  }, []);

  // ✅ 처음 로딩되거나 검색이 초기화되면 자동 호출
  useEffect(() => {
    if (search.length === 0) {
      // console.log("🔥 useEffect 실행됨, search:", search);
      fetchRecommendedIngredients();
    }
  }, [search, fetchRecommendedIngredients]);


  const handlePress = (index) => {
    const newStates = [...pressedStates];
    newStates[index] = !newStates[index];
    setPressedStates(newStates);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* <SearchBar value={search} onChangeText={setSearch} 
        placeholder="식재료를 추가해주세요" 
      /> */}
      <View style={styles.searchBar}>
        <SearchBar value={search} onChangeText={setSearch} 
          placeholder="식재료를 추가해주세요" 
        />
      </View>

      {filteredItems.length > 0 ? (
        <>
          <Text style={styles.searchMountText}>
            검색결과 {filteredItems.length}개
          </Text>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.ingredientId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem(selectedItem?.ingredientId === item.ingredientId ? null : item);
                }}
                style={[
                  styles.resultItem,
                  selectedItem?.ingredientId === item.ingredientId && styles.selectedItem,
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={{ uri: item.ingredientImage }} style={styles.itemImage} />
                  <View style={styles.threeText}>
                    <Text style={styles.itemName}>{item.ingredientName}</Text>
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
        search.length > 0 && (
          <Text style={styles.searchMountText}>검색 결과가 없습니다</Text>
        )
      )}


      {search.length === 0 && (
        <>
          <RefreshButton
            onPress={async () => {
              console.log("🔁 새로고침 버튼 클릭됨!");

              try {
                const token = await AsyncStorage.getItem("token");

                // 1️⃣ 먼저 추천 저장 요청 수행
                const res = await fetch("http://13.209.199.97:8080/diet/ingredient/rec/save", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams({
                    ingredientId: "1", // ✅ 여기에 실제 저장할 재료 ID를 넣어야 함
                  }).toString(),
                });

                const result = await res.text();
                console.log("✅ 추천 저장 응답:", result);

                // 2️⃣ 저장 성공 후 추천 재료 새로고침
                await fetchRecommendedIngredients();
              } catch (err) {
                console.error("❌ 새로고침 중 오류:", err);
              }
            }}
          />
          <Text style={styles.subTitle}>추천재료</Text>
          <FlatList
            data={ingredients}
            keyExtractor={(item, index) => {
              // console.log("🔥 item:", item);
              return item.ingredientId?.toString() ?? `fallback-${index}`;
            }}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContainer}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[styles.ingredientButton, pressedStates[index] && styles.pressedEffect]}
                onPress={() => handlePress(index)}
              >
                <Text style={styles.ingredientText}>{item.ingredient.ingredientName}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* 등록하기 버튼 */}
      <RegisterButton
        style={styles.registerButton}
        onPress={async () => {
          const token = await AsyncStorage.getItem("token");

          // ✅ 추천 재료 중 선택된 것들
          const selectedIngredients = ingredients.filter((_, idx) => pressedStates[idx]);

          // ✅ 검색 결과에서 선택된 항목도 추가 (중복 방지)
          const allToSave = [...selectedIngredients];
          if (
            selectedItem &&
            !selectedIngredients.some((item) => item.ingredientId === selectedItem.ingredientId)
          ) {
            allToSave.push(selectedItem);
          }

          for (const item of allToSave) {
            const ingredientId = item.ingredient?.ingredientId ?? item.ingredientId;
            const ingredientName = item.ingredient?.ingredientName ?? item.ingredientName;
            // console.log("📦 저장하는 ingredientId:", ingredientId);

            try {
              // 1. 추천 저장
              await fetch("http://13.209.199.97:8080/diet/ingredient/rec/save", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  ingredientId: ingredientId.toString(),
                }).toString(),
              });
              // console.log("✅ 추천 저장 성공:", ingredientName);
            } catch (err) {
              console.error("❌ 추천 저장 실패:", ingredientName, err);
            }

            try {
              // 2. 즐겨찾기 저장 (pref/save)
              const res = await fetch(`http://13.209.199.97:8080/diet/ingredient/pref/save?id=${ingredientId}`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const text = await res.text();
              if (!res.ok) {
                throw new Error(`❌ 저장 실패: ${text}`);
              }
              console.log("⭐️ 즐겨찾기 저장 응답:", text);
              // console.log("⭐️ 즐겨찾기 저장 성공:", ingredientName);
            } catch (err) {
              console.error("❌ 즐겨찾기 저장 실패:", ingredientName, err);
            }
          }

          navigation.navigate("DietRecommendation");
        }}
      />



      {/* 하단 네비게이션 바 */}
      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    alignItems: "center",
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
    bottom: 90,
  },
  registerText: {
    fontSize: 25,
    color: "#000",
    alignSelf: "center",
    paddingTop: 5,
  },
});
