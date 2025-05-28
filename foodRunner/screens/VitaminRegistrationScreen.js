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
  const [searchText, setSearchText] = useState(""); // 검색어 
  const [filteredItems, setFilteredItems] = useState([]); // 필터링 된 결과
  const [selectedsupplementItem, setSelectedsupplementItem] = useState(null); // 선택된 영양제
  const [supplementItems, setSupplementItems] = useState([]); // 전체 영양제 목록
  const [favoriteSupplementItems, setFavoriteSupplementItems] = useState([]); // 즐겨찾기된 supplementId 목록
  const [favoriteSupplementData, setFavoriteSupplementData] = useState([]);   // 즐겨찾기된 전체 supplement 객체 목록

  const route = useRoute();
  const selectedDate = route.params?.selectedDate;
  console.log("영양제 등록 페이지 받은 날짜:", selectedDate);

  // 즐겨찾기 불러오기
  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://13.209.199.97:8080/diet/sup/pref/load", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("즐겨찾기 영양제 로드: ", data);

      setFavoriteSupplementItems(data.map(
        (item) => item.supplementData.supplementId)
      );
      setFavoriteSupplementData(
        data.map((item) => ({
          ...item.supplementData,
          // prefId: item.id,
          presupplementId: item.presupplementId,
        }))
      );

      console.log("[📦 영양제 즐겨찾기 데이터]", data);
    } catch (err) {
      console.error("❌ 영양제 즐겨찾기 로드 실패:", err);
    }
  };

  // 즐겨찾기 등록, 삭제
  const toggleFavorite = async (item) => {
    const token = await AsyncStorage.getItem("token");
    const isFavorited = favoriteSupplementItems.includes(item.supplementId);
    try {
      if (isFavorited) {
        // if (!item.presupplementId) {
        //   console.warn("❗️ prefId가 없어 즐겨찾기 삭제 불가" ,item.presupplementId);
        //   return;
        // }
        // 즐겨찾기 삭제
        const res = await fetch(
          `http://13.209.199.97:8080/diet/sup/pref/delete?pref_id=${item.presupplementId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("삭제 실패");

        console.log("⭐️ 즐겨찾기 삭제 성공:", item.supplementName);
      } else {
        // 즐겨찾기 등록
        const res = await fetch(
          `http://13.209.199.97:8080/diet/sup/pref/save?sup_id=${item.supplementId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("등록 실패");
        // const resText = await res.text();
        // console.log("응답 내용: ", resText);

        console.log("⭐️ 즐겨찾기 등록 성공:", item.supplementName);
        // console.log("💊 등록 대상:", item.supplementId);

      }
      // const resText = await res.text();
      

      await fetchFavorites(); // 갱신
    } catch (err) {
      console.error("❌ 즐겨찾기 처리 오류:", err);
      // console.log("💊 등록 대상:", item.supplementId);
    }
    console.log("응답 내용: ", resText);
  };


  // 🔹 백엔드에서 전체 영양제 목록 가져오기
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

  useEffect(() => {
    const fetchAll = async () => {
      await fetchSupplements();
      await fetchFavorites();
    };

    fetchAll();
  }, []);

  // useEffect(() => {

  //   fetchSupplements();
  // }, []);

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

      <View style={{ flex: 1 }}>
        {searchText.length > 0 && (
          <Text style={styles.searchMountText}>
            검색결과 {filteredItems.length}개
          </Text>
        )}
          <FlatList
            data={searchText.length > 0 ? filteredItems : favoriteSupplementData}
            keyExtractor={(item) => item.supplementId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedsupplementItem(selectedsupplementItem?.supplementId === item.supplementId ? null : item)
                }}
                style={[
                  styles.resultItem,
                  selectedsupplementItem?.supplementId === item.supplementId &&
                    styles.selectedsupplementItem,
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => toggleFavorite(item)}
                    style={styles.favoriteButton}
                  >
                    <Ionicons
                      name={favoriteSupplementItems.includes(item.supplementId) ? "star" : "star-outline"}
                      size={24}
                      color={favoriteSupplementItems.includes(item.supplementId) ? "#E1FF01" : "#C0C0C0"}
                    />
                  </TouchableOpacity>
                  <Image
                    source={{ uri: item.supplementImage }}
                    style={styles.itemImage}
                  />
                  <View style={styles.threeText}>
                    {/* <Text style={styles.itemName}>{item.supplementName}</Text> */}
                    <Text style={styles.itemName}>
                      {item.supplementName.length > 10
                        ? `${item.supplementName.substring(0, 10)}...`
                        : item.supplementName}
                    </Text>
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
            ListEmptyComponent={
              <Text style={styles.searchMountText}>
                {searchText.length > 0 ? "검색 결과가 없습니다" : "즐겨찾기된 영양제가 없습니다"}
              </Text>
            }
          />
      </View>

      {/* 🔹 등록하기 버튼 */}
      <RegisterButton
        style={styles.registerButton}
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
                dateTime: `${selectedDate}T12:00:00`,
              }),
            });

            if (!response.ok) {
              throw new Error(`서버 오류: ${response.status}`);
            }

            alert("✅ 영양제 섭취 기록이 저장되었습니다.", selectedDate);
            // console.log("저장된 ㅕㅇ")

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
   registerButton: {
    bottom: 90,
  },
};

export default FoodSearchScreen;
