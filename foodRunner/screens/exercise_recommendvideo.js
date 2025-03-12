import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // ✅ 수정됨!
import { Ionicons } from "@expo/vector-icons";

export default function ExerciseRecommendVideo() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ 수정됨!
  const [selectedCategory, setSelectedCategory] = useState("어깨");

  // 🚀 URL에서 받은 category 값이 있으면 초기 선택 값으로 설정
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category);
    }
  }, [params.category]);

  // 운동 카테고리 목록
  const categories = ["어깨", "가슴", "팔", "하체", "복근", "등", "둔근", "종아리"];

  return (
    <View style={{ flex: 1, backgroundColor: "black", paddingTop: 40 }}>
      {/* 상단 헤더 */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>운동 영상</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", right: 20 }}>
          <Ionicons name="close" size={28} color="yellow" />
        </TouchableOpacity>
      </View>

      {/* ✅ 카테고리 탭 (가로 스크롤) */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, marginBottom: 5, paddingLeft: 20 }}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: selectedCategory === category ? "#E1FF01" : "#444",
                paddingVertical: 5,
                paddingHorizontal: 40,
                borderRadius: 12,
                marginRight: 8,
                height: 35,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={{ color: selectedCategory === category ? "black" : "white", fontSize: 14 }}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ✅ 추천 운동 (세로 스크롤) */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginTop: 10 }}>
        <Text style={{ color: "#E1FF01", fontSize: 16, fontWeight: "bold" }}>추천 운동</Text>
        
        {/* 💡 여기에 운동 영상 리스트 추가 가능 */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: "white", fontSize: 14 }}>추천 운동이 여기에 표시됩니다.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
