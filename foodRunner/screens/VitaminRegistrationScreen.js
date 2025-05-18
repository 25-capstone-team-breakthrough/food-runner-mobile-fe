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
  const [selectedsupplementItem, setSelectedsupplementItem] = useState(null);
  const [supplementItems, setSupplementItems] = useState([]);

  // 🔹 백엔드에서 전체 영양제 목록 가져오기
  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://13.209.199.97:8080/diet/sup/data/load", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();
        console.log(data)
        setSupplementItems(data);
      } catch (err) {
        console.error("❌ 영양제 데이터 로딩 실패:", err);
      }
    };

    fetchSupplements();
  }, []);

  // 🔹 검색어 변경 시 필터링
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const results = supplementItems.filter((item) =>
        item.supplementName.includes(text) || item.company?.includes?.(text)
      );
      setFilteredItems(results);
    } else {
      setFilteredItems([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar
          value={searchText}
          onChangeText={handleSearch}
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
            keyExtractor={(item) => item.supplementId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (selectedsupplementItem?.supplementId === item.supplementId) {
                    setSelectedsupplementItem(null);
                  } else {
                    setSelectedsupplementItem(item);
                  }
                }}
                style={[
                  styles.resultItem,
                  selectedsupplementItem?.supplementId === item.supplementId &&
                    styles.selectedsupplementItem,
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: item.supplementImage }}
                    style={styles.itemImage}
                  />
                  <View style={styles.threeText}>
                    <Text style={styles.itemName}>{item.supplementName}</Text>
                    <Text style={styles.itemBrand}>{item.company}</Text>
                    <Text style={styles.itemNutrient}>{item.mainNutrition}</Text>
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
        onPress={async () => {
          if (!selectedsupplementItem) {
            alert("영양제를 선택해주세요!");
            return;
          }

          try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch("http://13.209.199.97:8080/diet/sup/log/save", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: selectedsupplementItem.supplementId,
                dateTime: new Date().toISOString(),
              }),
            });

            if (!response.ok) {
              throw new Error(`서버 오류: ${response.status}`);
            }

            alert("✅ 영양제 섭취 기록이 저장되었습니다.");

            navigation.navigate("NutritionMain", 
          );
          } catch (err) {
            console.error("❌ 섭취 기록 저장 실패:", err);
            alert("섭취 기록 저장에 실패했습니다.");
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
