import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import BottomSheet from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Svg, { Polyline, Circle, Text as SvgText, Line } from "react-native-svg";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from "react-native-reanimated";

// Components
import BottomNavigation from "../components/BottomNavigation";
import ExerciseRegister from "../screens/exercise_register";
import ExerciseHistory from "../screens/exercise_history";


export default function ExerciseHome() {
  const navigation = useNavigation();

  const [isFrontView, setIsFrontView] = useState(true);
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

  const today = new Date();
  const formattedToday = useMemo(() => new Date().toISOString().split("T")[0].split("-").join("."), []);
  const [selectedDate, setSelectedDate] = useState(formattedToday);
  const [selectedDay, setSelectedDay] = useState(today.toLocaleDateString("ko-KR", { weekday: "short" }));

  const [inbodyList, setInbodyList] = useState([]);
  const latestInbody = inbodyList[0] || {};
  const muscleParts = (latestInbody.segmentalLeanAnalysis || '').split(',');

  const [muscleLevels, setMuscleLevels] = useState([]);

  const muscleStatus = {
    leftArm: muscleParts[0],
    rightArm: muscleParts[1],
    trunk: muscleParts[2],
    leftLeg: muscleParts[3],
    rightLeg: muscleParts[4],
  };

  useEffect(() => {
    const fetchInbody = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const res = await axios.get("http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/inbody/inbody-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInbodyList(res.data || []);
      } catch (err) {
        console.error('❌ 인바디 불러오기 실패', err);
      }
    };
    fetchInbody();
  }, []);

  const getButtonColor = (name) => {
    const { leftArm, rightArm, trunk, leftLeg, rightLeg } = muscleStatus;
  
    switch (name) {
      case "어깨":
        return (leftArm === "표준이하" && rightArm === "표준이하") ? "#FF3B30" : "#DDFB21";
  
      case "팔":
        return (leftArm === "표준이하" || rightArm === "표준이하") ? "#FF3B30" : "#DDFB21";
  
      case "가슴":
      case "복근":
      case "등":
        return trunk === "표준이하" ? "#FF3B30" : "#DDFB21";
  
      case "하체":
      case "둔근":
      case "종아리":
        return (leftLeg === "표준이하" || rightLeg === "표준이하") ? "#FF3B30" : "#DDFB21";
  
      default:
        return "#DDFB21";
    }
  };
  
  



  const rotation = useSharedValue(0); // 0deg or 180deg
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  const toggleFrontView = () => {
    setIsFrontView((prev) => !prev);
    rotation.value = withTiming(rotation.value === 0 ? 180 : 0, { duration: 400 });
  };
  const historySnapPoints = useMemo(() => ["80%"], []);
  const calendarSnapPoints = useMemo(() => ["80%"], []);

  const BODY_PART_POSITIONS = {
    front: [
      { name: "어깨", top: "25%", left: "37%" },
      { name: "가슴", top: "29%", left: "51%" },
      { name: "복근", top: "38%", left: "51%" },
      { name: "팔",   top: "36%", left: "68%" },
      { name: "하체", top: "58%", left: "59%" },
    ],
    back: [
      { name: "등",     top: "30%", left: "51%" },
      { name: "둔근",   top: "51%", left: "58%" },
      { name: "종아리", top: "70%", left: "43%" },
    ],
  };
  
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

  const markedDates = useMemo(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    const selected = selectedDate.replace(/\./g, "-");
  
    const result = {
      [selected]: {
        selected: true,
        selectedColor: "#DDFB21",
        selectedTextColor: "#000000",
      },
    };
  
    if (selected !== todayDate) {
      result[todayDate] = {
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor: "#E1FF01",
            borderRadius: 20,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 1,
          },
          text: {
            color: "#FFFFFF",
            fontWeight: "normal",
          },
        },
      };
    }
  
    return result;
  }, [selectedDate]);
    
  


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}>
      {/* 바텀시트가 열릴 때만 블러뷰를 표시 */}
      {(isCalendarSheetVisible || isBottomSheetVisible || isHistorySheetVisible) && (
        <BlurView
          intensity={100} // 블러 강도 설정 (0에서 100까지)
          tint="dark"
          style={[StyleSheet.absoluteFillObject, { zIndex: 10 }]} // zIndex 낮게
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
          backgroundColor: "#292929",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9,
        }}
        onPress={toggleFrontView} 
      >
        <Animated.View style={[animatedIconStyle]}>
          <Ionicons name="shuffle" size={30} color="#E1FF01" />
        </Animated.View>
      </TouchableOpacity>
      )}
      {/* 신체 이미지 및 버튼 */}
      <View style={{ position: "absolute", bottom: 150, alignItems: "center" }}>
        <Image
          source={              isFrontView
              ? require("../assets/body_front.png")
              : require("../assets/body_back.png")
          }
          style={{ width: 450, height: 700 }}
          resizeMode="contain"
        />
        {/* 부위별 버튼 */}
        {(isFrontView ? BODY_PART_POSITIONS.front : BODY_PART_POSITIONS.back).map(
          ({ name, top, left }) => (
            <TouchableOpacity
              key={name}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[buttonStyle(top, left), { backgroundColor: getButtonColor(name) }]}
              onPress={() => handleExerciseClick(name)}
            >
              <Text style={{ opacity: 0 }}>{name}</Text>
            </TouchableOpacity>
          )
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
        containerStyle={{ zIndex: 20 }} // BlurView보다 위에 위치
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
            markingType="custom"
            markedDates={markedDates}
            theme={{
              todayTextColor: "#FFFFFF",
              arrowColor: "#FFFFFF",
              textSectionTitleColor: "#FFFFFF",
              dayTextColor: "#FFFFFF",
              disabledDayTextColor: "#DDFB21",
              monthTextColor: "#FFFFFF",
              calendarBackground: "#2D2D35",
            }}
            style={{ backgroundColor: "#2D2D35" }}
            onDayPress={onDateSelect}
          />

          <View style={{ marginTop: 20 }}>
            <SimpleLineChart
              data={weeklyCalories}
              weekDates={weekLabels}
              todayLabel={`${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`}
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
        containerStyle={{ zIndex: 20 }} // BlurView보다 위에 위치
        sheetRef={sheetRef}
        onClose={handleCloseBottomSheet}
        setRefreshKey={setRefreshKey} 
        snapPoints={["80%"]}
        index={-1}
      />

      {/* 운동 히스토리 바텀시트 */}
      <BottomSheet
        containerStyle={{ zIndex: 20 }} // BlurView보다 위에 위치
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
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "black",
});
