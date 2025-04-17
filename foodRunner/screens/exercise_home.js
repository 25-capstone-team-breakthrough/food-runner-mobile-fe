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
import moment from "moment";

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
    // 날짜 선택 후 바로 이동하지 않도록 selectedDate 상태만 업데이트
    const formattedDate = date.dateString.split("-").join(".");
    const dayOfWeek = new Date(date.dateString).toLocaleString("ko-KR", {
      weekday: "short",
    });
    setSelectedDate(formattedDate);
    setSelectedDay(dayOfWeek);
  };

  // 선택하기 버튼을 눌러야 이동
  const handleSelectDate = () => {
    // 날짜 업데이트
    const formattedDate = selectedDate.replace(/\./g, "-");
    const dayOfWeek = new Date(formattedDate).toLocaleString("ko-KR", {
      weekday: "short",
    });
  
    setSelectedDate(selectedDate); // 선택된 날짜로 상태 업데이트
    setSelectedDay(dayOfWeek); // 선택된 날짜의 요일 업데이트
  
    // 바텀시트 닫기
    setIsCalendarSheetVisible(false);
    calendarSheetRef.current?.close(); // 바텀시트 닫기
  };

  const handleOpenBottomSheet = () => {
    setIsBottomSheetVisible(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  // handleOpenHistorySheet 함수 정의 추가
  const handleOpenHistorySheet = () => {
    setIsHistorySheetVisible(true);
    historySheetRef.current.expand(); // 히스토리 바텀시트를 확장합니다.
  };

  // handleCloseHistorySheet 함수 정의 추가
  const handleCloseHistorySheet = () => {
    setIsHistorySheetVisible(false);
    historySheetRef.current.close(); // 히스토리 바텀시트를 닫습니다.
  };
  // 날짜 계산 (선택된 날짜의 주 월요일부터 일요일까지 계산)
  const getWeekDates = (date) => {
    const startOfWeek = moment(date).startOf("week"); // 주의 시작(월요일)
    const endOfWeek = moment(date).endOf("week"); // 주의 끝(일요일)
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(startOfWeek.add(i, 'days').format("MM.DD")); // 월요일부터 일요일까지 날짜 포맷
    }
    return weekDates;
  };

  const weekDates = getWeekDates(selectedDate); // 선택된 날짜에 대한 주의 날짜들

  // Y축 데이터 생성: 0 ~ 1000 사이의 랜덤 값
  const generateRandomData = () => {
    return weekDates.map(() => Math.floor(Math.random() * 1001)); // 0 ~ 1000 사이의 랜덤 값
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}>
      {/* 바텀시트가 열릴 때만 블러뷰를 표시 */}
      {(isCalendarSheetVisible || isBottomSheetVisible || isHistorySheetVisible) && (
        <BlurView
          intensity={100} // 블러 강도 설정 (0에서 100까지)
          style={StyleSheet.absoluteFillObject} // 화면 전체를 덮도록 설정
        />
    )}
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
                selectedColor: "#DDFB21",
                selectedTextColor: "#000000", // 선택된 날짜 텍스트 색상
                selectedDayStyle: { // 선택된 날짜의 테두리 스타일
                  borderWidth: 10,
                  borderColor: "#DDFB21", // 테두리 색상
                  borderRadius: 500, // 테두리의 둥글기
                }
              },
            }}
            theme={{
              todayTextColor: "#FFFFFF", // 오늘 날짜 텍스트 색상
              arrowColor: "#FFFFFF", // 화살표 색상
              textSectionTitleColor: "#FFFFFF", // 달력 상단 요일 텍스트 색상
              dayTextColor: "#FFFFFF", // 모든 날짜 텍스트 색상
              disabledDayTextColor: "#DDFB21",
              monthTextColor: "#FFFFFF", // 월 텍스트 색상
              calendarBackground: "#2D2D35", // 달력 배경색 (여기에서 배경색을 변경)
            }}
            style={{ backgroundColor: "#2D2D35" }}  // 바텀시트 색과 동일하게 설정
            onDayPress={onDateSelect} // 날짜 선택 시 이동하지 않음
          />

          {/* 그래프 예시 (react-native-chart-kit 사용) */}
          <View style={{ marginTop: 10, alignItems: "center" }}>
            <LineChart
              data={{
                labels: weekDates,
                datasets: [
                  {
                    data: generateRandomData(), // 랜덤 Y축 데이터
                    fill: false,  // 선 아래 채우기 없음
                  },
                ],
              }}
              width={370} // 그래프의 너비
              height={100} // 그래프의 높이
              chartConfig={{
                backgroundGradientFrom: "#2D2D35",
                backgroundGradientTo: "#2D2D35",
                decimalPlaces: 0,
                color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForDots: {
                  r: "4",
                  strokeWidth: "1",
                  stroke: "#000",
                  fill: "#DDFB21",
                },
                yAxis: {
                  min: 0, // 최소값 0
                  max: 1000, // 최대값 1000
                  // 사용자 정의 Y축 레이블 (0, 500, 1000으로 고정)
                  yAxisInterval: 500, // 500 단위로 레이블을 표시
                },
              }}
              // bezier
              style={{ marginVertical: 8, borderRadius:  0}}
            />
          </View>

          {/* 선택하기 버튼 */}
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: "#E1FF01",
              paddingVertical: 12,
              borderRadius: 15,
              alignItems: "center",
            }}
            onPress={handleSelectDate} // 선택하기 버튼을 눌렀을 때 이동
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
