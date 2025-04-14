import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";
import { Calendar } from "react-native-calendars";
import ExerciseRegister from "../screens/exercise_register";
import BottomSheet from "@gorhom/bottom-sheet";
import ExerciseHistory from "../screens/exercise_history";
import { BlurView } from "expo-blur";
import { LineChart } from "react-native-chart-kit"; // 그래프 라이브러리 임포트

export default function ExerciseHome() {
  const navigation = useNavigation();
  const [isFrontView, setIsFrontView] = useState(true);
  const [selectedDate, setSelectedDate] = useState("2025.01.21");
  const [selectedDay, setSelectedDay] = useState("화");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isHistorySheetVisible, setIsHistorySheetVisible] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [isCalendarSheetVisible, setIsCalendarSheetVisible] = useState(false);
  const sheetRef = useRef(null);
  const historySheetRef = useRef(null);
  const calendarSheetRef = useRef(null);

  const historySnapPoints = useMemo(() => ["80%"], []);
  const calendarSnapPoints = useMemo(() => ["80%"], []);

  useEffect(() => {
    if (isBottomSheetVisible && sheetRef.current) {
      sheetRef.current.expand();
      setIsBottomNavVisible(false);
    } else if (!isBottomSheetVisible && sheetRef.current) {
      sheetRef.current.close();
      setIsBottomNavVisible(true);
    }
  }, [isBottomSheetVisible]);

  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0];
    const pretty = formatted.split("-").join(".");
    const dayName = today.toLocaleDateString("ko-KR", { weekday: "short" });
    setSelectedDate(pretty);
    setSelectedDay(dayName);
  }, []);

  const onDateSelect = (date) => {
    const formattedDate = date.dateString.split("-").join(".");
    const dayOfWeek = new Date(date.dateString).toLocaleString("ko-KR", {
      weekday: "short",
    });
    setSelectedDate(formattedDate);
    setSelectedDay(dayOfWeek);
    setIsCalendarSheetVisible(false);
  };

  const handleExerciseClick = (exercise) => {
    if (exercise) {
      navigation.navigate("ExerciseRecommendVideo", { category: exercise });
    }
  };

  const handleOpenBottomSheet = () => {
    setIsBottomSheetVisible(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  const handleOpenHistorySheet = () => {
    setIsHistorySheetVisible(true);
    historySheetRef.current.expand();
  };

  const handleCloseHistorySheet = () => {
    setIsHistorySheetVisible(false);
    historySheetRef.current.close();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}>
      {/* 셔플 버튼 */}
      {!isBottomSheetVisible && !isHistorySheetVisible && (
        <TouchableOpacity
          style={{ position: "absolute", top: 70, right: 20 }}
          onPress={() => setIsFrontView(!isFrontView)}
        >
          <Ionicons name="shuffle" size={30} color="#E1FF01" />
        </TouchableOpacity>
      )}

      {/* 신체 이미지 및 버튼 */}
      <View style={{ position: "absolute", bottom: 180, alignItems: "center" }}>
        <Image
          source={
            isFrontView
              ? require("../assets/body_front.png")
              : require("../assets/body_back.png")
          }
          style={{ width: 360, height: 580 }}
          resizeMode="contain"
        />

        {/* 부위별 버튼 */}
        {isFrontView ? (
          <>
            <TouchableOpacity style={buttonStyle("25%", "37%")} onPress={() => handleExerciseClick("어깨")}>
              <Text style={{ opacity: 0 }}>어깨</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyle("29%", "51%")} onPress={() => handleExerciseClick("가슴")}>
              <Text style={{ opacity: 0 }}>가슴</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyle("38%", "51%")} onPress={() => handleExerciseClick("복근")}>
              <Text style={{ opacity: 0 }}>복근</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyle("36%", "68%")} onPress={() => handleExerciseClick("팔")}>
              <Text style={{ opacity: 0 }}>팔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyle("58%", "59%")} onPress={() => handleExerciseClick("하체")}>
              <Text style={{ opacity: 0 }}>하체</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={buttonStyle("30%", "51%")} onPress={() => handleExerciseClick("등")}>
              <Text style={{ opacity: 0 }}>등</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyle("51%", "58%")} onPress={() => handleExerciseClick("둔근")}>
              <Text style={{ opacity: 0 }}>둔근</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyle("75%", "43%")} onPress={() => handleExerciseClick("종아리")}>
              <Text style={{ opacity: 0 }}>종아리</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 칼로리 카드 */}
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
          <TouchableOpacity onPress={() => {
            setIsCalendarSheetVisible(true);
            calendarSheetRef.current?.expand();
          }}>
            <Ionicons name="calendar" size={30} color="white" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 16, marginLeft: 10 }}>
            {selectedDate} ({selectedDay})
          </Text>
        </View>

        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "white", fontSize: 16, marginBottom: 5 }}>소모한 칼로리</Text>
          <Text style={{ color: "white", fontSize: 38, fontWeight: "bold" }}>
            500 <Text style={{ fontSize: 20 }}>kcal</Text>
          </Text>
        </View>

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
            onPress={handleOpenBottomSheet}
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
            onPress={handleOpenHistorySheet}
          >
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 달력 바텀시트 */}
      <BottomSheet
        ref={calendarSheetRef}
        index={-1}
        snapPoints={calendarSnapPoints}
        onClose={() => setIsCalendarSheetVisible(false)}
        backgroundStyle={{ backgroundColor: "#2D2D35" }}
        enablePanDownToClose={true}
      >
        <View style={{ padding: 20 }}>
          <Calendar
            locale="ko"
            markedDates={{
              [selectedDate.replace(/\./g, "-")]: {
                selected: true,
                selectedColor: "#E1FF01",
              },
            }}
            style={{ backgroundColor: "#2D2D35" }}  // 바텀시트 색과 동일하게 설정
            onDayPress={(day) => {
              onDateSelect(day);
              calendarSheetRef.current?.close();
            }}
          />

          {/* 그래프 예시 (react-native-chart-kit 사용) */}
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <LineChart
              data={{
                labels: ["01.20", "01.21", "01.22", "01.23", "01.24", "01.25", "01.26"],
                datasets: [
                  {
                    data: [2000, 1800, 2200, 2500, 2100, 2300, 2000],
                  },
                ],
              }}
              width={300} // 그래프의 너비
              height={200} // 그래프의 높이
              chartConfig={{
                backgroundColor: "#333",
                backgroundGradientFrom: "#333",
                backgroundGradientTo: "#333",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#E1FF01",
                },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>

          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: "#E1FF01",
              paddingVertical: 12,
              borderRadius: 15,
              alignItems: "center",
            }}
            onPress={() => calendarSheetRef.current?.close()}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>선택하기</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* 운동 등록 바텀시트 */}
      <ExerciseRegister
        sheetRef={sheetRef}
        onClose={handleCloseBottomSheet}
        snapPoints={["80%"]}
        index={-1}
      />

      {/* 운동 히스토리 바텀시트 */}
      <BottomSheet
        ref={historySheetRef}
        index={-1}
        snapPoints={historySnapPoints}
        onClose={handleCloseHistorySheet}
        backgroundStyle={{ backgroundColor: "#2D2D35" }}
        enablePanDownToClose={true}
      >
        <ExerciseHistory
          onClose={handleCloseHistorySheet}
          selectedDate={selectedDate}
        />
      </BottomSheet>

      {/* 하단 네비게이션 */}
      {isBottomNavVisible && <BottomNavigation />}
    </SafeAreaView>
  );
}

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
