import React, { useState, useRef, useEffect, useMemo } from "react";
import { SafeAreaView, Text, Image, TouchableOpacity, View, StyleSheet, Dimensions} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";
import { Calendar } from "react-native-calendars";
import ExerciseRegister from "../screens/exercise_register";
import BottomSheet from "@gorhom/bottom-sheet";
import ExerciseHistory from "../screens/exercise_history";
import { BlurView } from "expo-blur";
import Svg, { Polyline, Circle, Text as SvgText, Line } from 'react-native-svg';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


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
  const [totalCalories, setTotalCalories] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const [weekLabels, setWeekLabels] = useState([]);
  






  const historySnapPoints = useMemo(() => ["80%"], []);
  const calendarSnapPoints = useMemo(() => ["80%"], []);

  const SimpleLineChart = ({ data, weekDates, todayLabel }) => {
    const graphWidth = 330;
    const graphHeight = 160;
    const paddingLeft = 30;
    const paddingRight = 10;
    const paddingTop = 20;
    const paddingBottom = 30;
    const yMax = 1000;
  
    const spacing = (graphWidth - paddingLeft - paddingRight) / (weekDates.length + 1);
  
    const pointCoordinates = data.map((value, index) => {
      const x = paddingLeft + spacing * (index + 1);
      const y = paddingTop + (1 - value / yMax) * (graphHeight - paddingTop - paddingBottom);
      return { x, y };
    });
  
    const polylinePoints = pointCoordinates.map(p => `${p.x},${p.y}`).join(' ');
  
    return (
      <View style={{ alignItems: 'center' }}>
        <Svg width={graphWidth} height={graphHeight}>
          {/* Y축 */}
          <Line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={graphHeight - paddingBottom} stroke="#888" strokeWidth="1" />
  
          {/* X축 */}
          <Line x1={paddingLeft} y1={graphHeight - paddingBottom} x2={graphWidth - paddingRight} y2={graphHeight - paddingBottom} stroke="#888" strokeWidth="1" />
  
          {/* 🔥 가로선 (Grid Lines) */}
          {[0, 250, 500, 750, 1000].map((yValue, idx) => {
            const y = paddingTop + (1 - yValue / yMax) * (graphHeight - paddingTop - paddingBottom);
            const isZeroLine = yValue === 0;
            return (
              <Line
                key={`h-line-${idx}`}
                x1={paddingLeft}
                y1={y}
                x2={graphWidth - paddingRight}
                y2={y}
                stroke="#555555"
                strokeDasharray={isZeroLine ? undefined : "4 2"}
                strokeWidth="0.7"
              />
            );
          })}

  
          {/* Y축 레이블 */}
          {[0, 250, 500, 750, 1000].map((yValue, idx) => {
            const y = paddingTop + (1 - yValue / yMax) * (graphHeight - paddingTop - paddingBottom);
            return (
              <SvgText
                key={`y-label-${idx}`}
                x={paddingLeft - 8}
                y={y + 4}
                fontSize="10"
                fill="white"
                textAnchor="end"
              >
                {yValue}
              </SvgText>
            );
          })}

  
          {/* X축 레이블 */}
          {weekDates.map((label, idx) => {
            const x = paddingLeft + spacing * (idx + 1);
            return (
              <SvgText
                key={`x-label-${idx}`}
                x={x}
                y={graphHeight - 10}
                fontSize="10"
                fill="white"
                textAnchor="middle"
              >
                {label}
              </SvgText>
            );
          })}
  
          {/* 라인 */}
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke="#555555"
            strokeWidth="2"
          />
  
          {/* 점 */}
          {pointCoordinates.map((point, idx) => {
            const isToday = weekDates[idx] === todayLabel; // 오늘이면 강조 스타일 적용
            return (
              <Circle
                key={`point-${idx}`}
                cx={point.x}
                cy={point.y}
                r={isToday ? 5 : 3}
                fill={isToday ? "#E1FF01" : "#DDFB21"}
                stroke={isToday ? "#FFFFFF" : "none"}
                strokeWidth={isToday ? 1.5 : 0}
              />
            );
          })}

        </Svg>
      </View>
    );
  };
  
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

  useEffect(() => {
    const fetchCalories = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(
          "http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/exercise/calories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        // 📆 선택된 날짜 객체
        const selected = new Date(selectedDate.replace(/\./g, '-'));
        const formattedToday = selected.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  
        // 🗓️ 주간 시작일 (일요일)
        const startOfWeek = new Date(selected);
        startOfWeek.setDate(selected.getDate() - selected.getDay());
  
        const weekLabels = [];
        const weekTotals = [];
  
        for (let i = 0; i < 7; i++) {
          const d = new Date(startOfWeek);
          d.setDate(startOfWeek.getDate() + i);
  
          const iso = d.toISOString().slice(0, 10); // YYYY-MM-DD
          const label = `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
          weekLabels.push(label);
  
          const dayLogs = res.data.filter(log => log.createdAt.slice(0, 10) === iso);
          const total = dayLogs.reduce((sum, log) => sum + (log.caloriesBurned || 0), 0);
          weekTotals.push(total);
  
          // ✅ 오늘 날짜일 경우 홈화면용 totalCalories 저장
          if (iso === formattedToday) {
            setTotalCalories(total);
          }
        }
  
        setWeeklyCalories(weekTotals);
        setWeekLabels(weekLabels);
  
      } catch (err) {
        console.error("❌ 칼로리 조회 실패:", err.response?.data || err.message);
      }
    };
  
    fetchCalories();
  }, [selectedDate, refreshKey]);
      
  
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

  const handleExerciseClick = (exercise) => {
    if (exercise) {
      navigation.navigate("ExerciseRecommendVideo", { category: exercise });
    }
  };
  const getWeekRangeLabels = (dateString) => {
    const targetDate = new Date(dateString); // '2025-05-13'
    const dayOfWeek = targetDate.getDay(); // 0 (일) ~ 6 (토)
    
    // 일요일 시작일 구하기
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(targetDate.getDate() - dayOfWeek);
  
    const labels = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      labels.push(`${mm}.${dd}`);
    }
  
    return labels;
  };
  


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}>
      {/* 바텀시트가 열릴 때만 블러뷰를 표시 */}
      {(isCalendarSheetVisible || isBottomSheetVisible || isHistorySheetVisible) && (
        <BlurView
          intensity={100} // 블러 강도 설정 (0에서 100까지)
          tint="dark"
          style={StyleSheet.absoluteFillObject} // 화면 전체를 덮도록 설정
        />
    )}
      {/* 셔플 버튼 */}
      {!isBottomSheetVisible && !isHistorySheetVisible && (
        <TouchableOpacity
          style={{ 
            position: "absolute",
            top: 80,
            right: 30,
            width: 40,
            height: 40,
            borderRadius: 25,
            backgroundColor: "#292929", // ✅ 어두운 회색 배경 추가
            justifyContent: "center",
            alignItems: "center", 
            zIndex: 10,
          }}
          onPress={() => setIsFrontView(!isFrontView)}
        >
          <Ionicons name="shuffle" size={30} color="#E1FF01" />
        </TouchableOpacity>
      )}

      {/* 신체 이미지 및 버튼 */}
      <View style={{ position: "absolute", bottom: 150, alignItems: "center" }}>
        <Image
          source={
            isFrontView
              ? require("../assets/body_front.png")
              : require("../assets/body_back.png")
          }
          style={{ width: 450, height: 700 }}
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
            {totalCalories} <Text style={{ fontSize: 20 }}>kcal</Text>
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

          {/* 마이크 버튼 추가 */}
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 130,
              left: 275,
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("VoiceExerciseLogger")}
          >
            <Ionicons name="mic" size={30} color="black" />
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

          <View style={{ marginTop: 20 }}>
          <SimpleLineChart
            data={weeklyCalories}
            weekDates={weekLabels}
            todayLabel={selectedDate.slice(5)} // selectedDate: "2025.05.13" → "05.13" 추출
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
            onPress={handleSelectDate}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>선택하기</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* 운동 등록 바텀시트 */}
      <ExerciseRegister
        sheetRef={sheetRef}
        onClose={handleCloseBottomSheet}
        setRefreshKey={setRefreshKey} 
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
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
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