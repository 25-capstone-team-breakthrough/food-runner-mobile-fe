import { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import BottomNavigation from "../components/BottomNavigation";

export default function ExerciseHome() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isFrontView, setIsFrontView] = useState(true); // 앞/뒤 이미지 상태

  // 날짜 선택 핸들러
  const handleConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  };

  // ✅ 특정 부위를 클릭하면 exercise_recommendvideo.js로 이동
  const navigateToExerciseVideo = (bodyPart) => {
    router.push(`/exercise_recommendvideo?category=${bodyPart}`); // URL 쿼리로 이동
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}>
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
          source={
            isFrontView
              ? require("../assets/body_front.png")
              : require("../assets/body_back.png")
          }
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
        {/* 날짜 선택 */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={{ padding: 5 }}>
            <Ionicons name="calendar" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 16, marginLeft: 10 }}>
            {selectedDate.toISOString().split("T")[0]}
          </Text>
        </View>

        {/* 칼로리 정보 (한 줄 정렬) */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
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
            onPress={() => router.push("/exercise_register")}
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
            onPress={() => router.push("/exercise_history")}
          >
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 날짜 선택 모달 */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />

      {/* 하단 네비게이션 추가 */}
      <BottomNavigation /> {/* 이 부분을 추가하여 하단 네비게이션이 표시되도록 함 */}
    </View>
  );
}

/* 🔥 버튼 스타일 함수 (위치 자동 설정) */
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
