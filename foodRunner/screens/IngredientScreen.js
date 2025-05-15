import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
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
  useEffect(() => {
    console.log("🔥 useEffect 실행됨, search:", search);
    const fetchRecommendedIngredients = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://13.209.199.97:8080/diet/ingredient/rec/load", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const text = await res.text();
        console.log("🧾 응답 텍스트:", text);
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error("데이터 형식 오류");
        console.log(data)
        setIngredients(data);
        setPressedStates(new Array(data.length).fill(false));
        
      } catch (err) {
        console.error("❌ 추천 식재료 불러오기 실패:", err);
      }
    };

    if (search.length === 0) {
      fetchRecommendedIngredients();
    }
  }, [search]);


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
          placeholder="제품명/추가해주세요" 
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
          <RefreshButton onPress={() => console.log("새로고침 버튼 클릭됨!")} />
          <Text style={styles.subTitle}>추천재료</Text>
          <FlatList
            data={ingredients}
            keyExtractor={(item, index) => {
              console.log("🔥 item:", item);
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

        // ✅ 모두 저장 요청 보내기
        for (const item of allToSave) {
          try {
            await fetch("http://13.209.199.97:8080/diet/ingredient/rec/save", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded", // URLSearchParams 사용 시
              },
              body: new URLSearchParams({
                ingredientId: item.ingredient.ingredientId.toString(),
              }).toString(),
            });
            console.log("✅ 저장 성공:", item.ingredient.ingredientName);
          } catch (err) {
            console.error("❌ 저장 실패:", item.ingredient.ingredientName, err);
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
