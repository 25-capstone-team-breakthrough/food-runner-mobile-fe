import React, { useState } from "react";
import { SafeAreaView, Text, Image, TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // useNavigation 훅을 사용
import BottomNavigation from "../components/BottomNavigation";

export default function ExerciseHome() {
  const navigation = useNavigation(); // useNavigation 훅을 사용하여 네비게이션 객체를 가져옵니다.
  const [isFrontView, setIsFrontView] = useState(true); // 앞/뒤 이미지 상태

  // 운동 영상 페이지로 이동 (카테고리 전달)
  const navigateToExerciseVideo = (bodyPart) => {
    navigation.navigate("ExerciseRecommendVideo", { category: bodyPart }); // ExerciseRecommendVideo 화면으로 이동, category 파라미터 전달
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}>
      {/* 상단 셔플 버튼 (앞/뒤 변경) */}
      <TouchableOpacity
        style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
        onPress={() => setIsFrontView(!isFrontView)}
      >
        <Ionicons name="shuffle" size={30} color="yellow" />
      </TouchableOpacity>

      {/* 인체 모델 이미지 */}
      <View style={{ position: "relative", alignItems: "center", marginTop: 60 }}>
        <Image
          source={isFrontView ? require("../assets/body_front.png") : require("../assets/body_back.png")}
          style={{ width: 320, height: 520 }}
          resizeMode="contain"
        />

        {/* 🔥 이미지 위 버튼 (앞/뒤에 따라 다르게 렌더링) */}
        {isFrontView ? (
          <>
            <TouchableOpacity style={buttonStyle("20%", "29%")} onPress={() => navigateToExerciseVideo("어깨")} />
            <TouchableOpacity style={buttonStyle("24%", "44%")} onPress={() => navigateToExerciseVideo("가슴")} />
            <TouchableOpacity style={buttonStyle("35%", "44%")} onPress={() => navigateToExerciseVideo("복근")} />
            <TouchableOpacity style={buttonStyle("37%", "64%")} onPress={() => navigateToExerciseVideo("팔")} />
            <TouchableOpacity style={buttonStyle("56%", "52%")} onPress={() => navigateToExerciseVideo("하체")} />
          </>
        ) : (
          <>
            <TouchableOpacity style={buttonStyle("26%", "42%")} onPress={() => navigateToExerciseVideo("등")} />
            <TouchableOpacity style={buttonStyle("51%", "48%")} onPress={() => navigateToExerciseVideo("둔근")} />
            <TouchableOpacity style={buttonStyle("60%", "48%")} onPress={() => navigateToExerciseVideo("종아리")} />
          </>
        )}
      </View>

      {/* 칼로리 정보 카드 */}
      <View
        style={{
          position: "absolute",
          bottom: 100,
          width: "90%",
          backgroundColor: "#333",
          padding: 18,
          borderRadius: 15,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>소모한 칼로리</Text>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
            500 <Text style={{ fontSize: 16 }}>kcal</Text>
          </Text>
        </View>

        {/* 버튼 컨테이너 */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#E1FF01",
              paddingVertical: 10,
              borderRadius: 20,
              alignItems: "center",
              marginRight: 5,
            }}
            onPress={() => navigation.navigate("ExerciseRegister")} // ExerciseRegister 화면으로 이동
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>운동 등록하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#E1FF01",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            }}
            onPress={() => navigation.navigate("ExerciseHistory")} // ExerciseHistory 화면으로 이동
          >
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 네비게이션 추가 */}
      <BottomNavigation />
    </SafeAreaView>
  );
}

// 🔥 버튼 스타일 함수 (위치 자동 설정)
const buttonStyle = (top, left) => ({
  position: "absolute",
  top,
  left,
  transform: [{ translateX: -7 }],
  width: 7,
  height: 7,
  backgroundColor: "#DDFB21",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "black",
});
