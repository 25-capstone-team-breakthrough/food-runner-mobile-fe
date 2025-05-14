import { useEffect, useState } from "react";
import {
  FlatList,
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
  // const [ingredients, setIngredients] = useState([
  //   "바나나",
  //   "프로틴 쉐이크",
  //   "삶은 달걀",
  //   "고등어",
  //   "양배추",
  //   "시금치",
  //   "사과",
  //   "두부",
  //   "삶은 달걀",
  //   "고등어",
  //   "양배추",
  //   "시금치",
  //   "사과",
  //   "두부",
  // ]);
  // 테스트


  useEffect(() => {
    if (search.trim().length === 0) {
      setFilteredItems([]);
      return;
    }

    fetch("http://13.209.199.97:8080/diet/ingredient/data/load")
      .then((res) => res.json())
      .then((data) => {
        console.log("검색데이터:",data)
        const filtered = data.filter((item) =>
          item.foodName.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredItems(filtered);
      })
      .catch((err) => console.error("검색 실패:", err));
      
  }, [search]);

  // 추천 식재료 불러오기 (처음 로딩 + 검색어가 없을 때만)
  useEffect(() => {
    if (search.length === 0) {
      fetch("http://13.209.199.97:8080/diet/ingredient/rec/load")
        .then((res) => res.json())
        .then((data) => {
          console.log("추천식재료데이터:",data)
          setIngredients(data);
          setPressedStates(new Array(data.length).fill(false));
        })
        .catch((err) => console.error("추천 식재료 불러오기 실패:", err));
        console.log(data)
    }
  }, [search]);

  const handlePress = (index) => {
    const newStates = [...pressedStates];
    newStates[index] = !newStates[index];
    setPressedStates(newStates);
  };

  return (
    <View style={styles.container}>
      
      <SearchBar value={search} onChangeText={setSearch} 
        placeholder="식재료를 추가해주세요" 
      />

      {filteredItems.length > 0 ? (
        <>
          <Text style={{ alignSelf: 'flex-start', marginLeft: 30, fontSize: 16 }}>
            검색결과 {filteredItems.length}개
          </Text>
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem(selectedItem === item ? null : item);
                  console.log("선택된 아이템:", item);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: selectedItem === item ? '#e0f7fa' : '#f1f1f1',
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 4,
                  marginHorizontal: 20,
                }}
              >
                <Text style={{ fontSize: 16 }}>{item.foodName || item}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        search.length > 0 && (
          <Text style={{ alignSelf: 'center', marginVertical: 20 }}>
            검색 결과가 없습니다.
          </Text>
        )
      )}


      {search.length === 0 && (
        <>
          <RefreshButton onPress={() => console.log("새로고침 버튼 클릭됨!")} />
          <Text style={styles.subTitle}>추천재료</Text>
          <FlatList
            data={ingredients}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContainer}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[styles.ingredientButton, pressedStates[index] && styles.pressedEffect]}
                onPress={() => handlePress(index)}
              >
                <Text style={styles.ingredientText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}



      {/* 등록하기 버튼 */}
      <RegisterButton onPress={() => navigation.navigate("DietRecommendation")} />

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
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 5,
    marginBottom: 10,
    height: 50,
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
