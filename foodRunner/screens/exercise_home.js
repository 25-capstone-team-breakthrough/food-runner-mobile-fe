import React, { useState } from "react";
import { SafeAreaView, Text, Image, TouchableOpacity, StyleSheet, View, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // useNavigation 훅을 사용
import BottomNavigation from "../components/BottomNavigation";
import { Calendar } from "react-native-calendars"; // react-native-calendars 라이브러리 추가

export default function ExerciseHome() {
  const navigation = useNavigation(); // useNavigation 훅을 사용하여 네비게이션 객체를 가져옵니다.
  const [isFrontView, setIsFrontView] = useState(true); // 앞/뒤 이미지 상태
  const [showCalendar, setShowCalendar] = useState(false); // 달력 모달을 보여줄지 말지 결정하는 상태
  const [selectedDate, setSelectedDate] = useState("2025.01.21"); // 선택된 날짜
  const [selectedDay, setSelectedDay] = useState("화"); // 선택된 요일

  // 운동 영상 페이지로 이동 (카테고리 전달)
  const navigateToExerciseVideo = (bodyPart) => {
    navigation.navigate("ExerciseRecommendVideo", { category: bodyPart }); // ExerciseRecommendVideo 화면으로 이동, category 파라미터 전달
  };

  // 날짜를 선택했을 때
  const onDateSelect = (date) => {
    const formattedDate = date.dateString.split("-").join("."); // "2025.01.21" 형태로 변환
    const dayOfWeek = new Date(date.dateString).toLocaleString("ko-KR", { weekday: "short" }); // 요일을 추출
    setSelectedDate(formattedDate);
    setSelectedDay(dayOfWeek); // 요일 설정
    setShowCalendar(false); // 달력 모달 닫기
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}>
      {/* 상단 셔플 버튼 (앞/뒤 변경) */}
      <TouchableOpacity
        style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
        onPress={() => setIsFrontView(!isFrontView)}
      >
        <Ionicons name="shuffle" size={30} color="#E1FF01" />
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
        {/* 날짜와 요일 추가 - 소모한 칼로리 위로 위치 이동 */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <Ionicons name="calendar" size={30} color="white" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 16, marginLeft: 10 }}>
            {selectedDate} ({selectedDay})
          </Text>
        </View>

        {/* 소모한 칼로리 정보 */}
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "white", fontSize: 16, marginBottom: 5 }}>소모한 칼로리</Text>
          <Text style={{ color: "white", fontSize: 38, fontWeight: "bold" }}>
            500 <Text style={{ fontSize: 20 }}>kcal</Text>
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

      {/* 달력 모달 */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Calendar
              markedDates={{ [selectedDate]: { selected: true, selectedColor: "#E1FF01" } }}
              onDayPress={(day) => onDateSelect(day)}
            />
            <TouchableOpacity
              style={{ marginTop: 20, backgroundColor: "#E1FF01", padding: 10, borderRadius: 5, alignItems: "center" }}
              onPress={() => setShowCalendar(false)}
            >
              <Text>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
