import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";
import { Calendar } from "react-native-calendars";
import ExerciseRegister from "../screens/exercise_register"; // 바텀시트 컴포넌트 import
import BottomSheet from "@gorhom/bottom-sheet"; // 바텀시트 컴포넌트 import
import ExerciseHistory from "../screens/exercise_history"; // ExerciseHistory 화면 임포트

export default function ExerciseHome() {
  const navigation = useNavigation();
  const [isFrontView, setIsFrontView] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025.01.21");
  const [selectedDay, setSelectedDay] = useState("화");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false); // 바텀시트 상태 관리
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true); // 하단 네비게이션바 상태 관리
  const [isImageBlurred, setIsImageBlurred] = useState(false); // 이미지 흐림 상태 관리
  const [isButtonBlurred, setIsButtonBlurred] = useState(false); // 버튼 흐림 상태 관리
  const sheetRef = useRef(null); // 바텀시트 참조
  const historySheetRef = useRef(null); // ExerciseHistory 바텀시트 참조

  useEffect(() => {
    if (isBottomSheetVisible && sheetRef.current) {
      sheetRef.current.expand(); // 상태가 true로 바뀌면 바텀시트 확장
      setIsBottomNavVisible(false); // 바텀시트가 열리면 하단 네비게이션 숨기기
      setIsImageBlurred(true); // 바텀시트가 열리면 이미지 흐림
      setIsButtonBlurred(true); // 바텀시트가 열리면 버튼도 흐림
    } else if (!isBottomSheetVisible && sheetRef.current) {
      sheetRef.current.close(); // 상태가 false로 바뀌면 바텀시트 닫기
      setIsBottomNavVisible(true); // 바텀시트가 닫히면 하단 네비게이션 보이기
      setIsImageBlurred(false); // 바텀시트가 닫히면 이미지 흐림 해제
      setIsButtonBlurred(false); // 바텀시트가 닫히면 버튼 흐림 해제
    }
  }, [isBottomSheetVisible]);

  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0]; // yyyy-mm-dd
    const pretty = formatted.split("-").join(".");       // yyyy.mm.dd
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
    setShowCalendar(false);
  };

  const handleExerciseClick = (exercise) => {
    // 운동 이름 클릭 시 ExerciseRecommendVideo로 이동
    navigateToExerciseVideo(exercise);
  };

  const historySnapPoints = useMemo(() => ["80%"], []);

  const navigateToExerciseVideo = (exerciseName) => {
    console.log("Exercise Name: ", exerciseName);  // exerciseName이 잘 전달되는지 확인
    if (exerciseName) {
      navigation.navigate('ExerciseRecommendVideo', { category: exerciseName }); // ExerciseRecommendVideo로 이동
    } else {
      console.log("운동 이름이 없습니다.");
    }
  };

  const handleOpenBottomSheet = () => {
    setIsBottomSheetVisible(true); // 바텀시트를 보이게 하기 위해 상태 업데이트
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false); // 바텀시트를 닫기 위해 상태 업데이트
  };

  const handleOpenHistorySheet = () => {
    historySheetRef.current.expand(); // ExerciseHistory 바텀시트 열기
  };

  const handleCloseHistorySheet = () => {
    historySheetRef.current.close(); // ExerciseHistory 바텀시트 닫기
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}>
      {/* 셔플 버튼: 바텀시트가 열리면 숨기기 */}
      {!isBottomSheetVisible && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 70,
            right: 20,
          }}
          onPress={() => setIsFrontView(!isFrontView)}
        >
          <Ionicons name="shuffle" size={30} color="#E1FF01" />
        </TouchableOpacity>
      )}

      {/* 신체 이미지 */}
      <View style={{ position: "absolute", bottom: 180, alignItems: "center" }}>
        <Image
          source={
            isFrontView
              ? require("../assets/body_front.png")
              : require("../assets/body_back.png")
          }
          style={{ width: 360, height: 580 }}
          resizeMode="contain"
          blurRadius={isImageBlurred ? 5 : 0} // isImageBlurred 값에 따라 흐림 처리
        />

        {/* 이미지 위 버튼 */}
        {isFrontView ? (
          <>
            <TouchableOpacity
              style={[buttonStyle("25%", "37%"), isButtonBlurred && { opacity: 0.5 }]}
              onPress={() => handleExerciseClick("어깨")}
            >
              <Text style={{ opacity: 0 }}>어깨</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyle("29%", "51%"), isButtonBlurred && { opacity: 0.5 }]}
              onPress={() => handleExerciseClick("가슴")}
            >
              <Text style={{ opacity: 0 }}>가슴</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyle("38%", "51%"), isButtonBlurred && { opacity: 0.5 }]}
              onPress={() => handleExerciseClick("복근")}
            >
              <Text style={{ opacity: 0 }}>복근</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyle("36%", "68%"), isButtonBlurred && { opacity: 0.5 }]}
              onPress={() => handleExerciseClick("팔")}
            >
              <Text style={{ opacity: 0 }}>팔</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyle("58%", "59%"), isButtonBlurred && { opacity: 0.5 }]}
              onPress={() => handleExerciseClick("하체")}
            >
              <Text style={{ opacity: 0 }}>하체</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[buttonStyle("30%", "51%"), isButtonBlurred && { opacity: 0.5 }]}
              onPress={() => handleExerciseClick("등")}
            >
              <Text style={{ opacity: 0 }}>등</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyle("51%", "58%"), isButtonBlurred && { opacity: 0.5 }]}
              onPress={() => handleExerciseClick("둔근")}
            >
              <Text style={{ opacity: 0 }}>둔근</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyle("75%", "43%"), isButtonBlurred && { opacity: 0.5 }]}
              onPress={() => handleExerciseClick("종아리")}
            >
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
        {/* 날짜 표시 */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <Ionicons name="calendar" size={30} color="white" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 16, marginLeft: 10 }}>
            {selectedDate} ({selectedDay})
          </Text>
        </View>

        {/* 칼로리 정보 */}
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "white", fontSize: 16, marginBottom: 5 }}>소모한 칼로리</Text>
          <Text style={{ color: "white", fontSize: 38, fontWeight: "bold" }}>
            500 <Text style={{ fontSize: 20 }}>kcal</Text>
          </Text>
        </View>

        {/* 버튼 영역 */}
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
            onPress={handleOpenBottomSheet} // 버튼을 눌렀을 때 바텀시트 열기
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
            onPress={handleOpenHistorySheet} // ExerciseHistory 바텀시트 열기
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
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
          <Calendar
            locale={"ko"}
            markedDates={{
              [selectedDate.replace(/\./g, "-")]: { selected: true, selectedColor: "#E1FF01" }
            }}
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

      {/* 바텀시트 컴포넌트 */}
      <ExerciseRegister
        sheetRef={sheetRef}
        onClose={handleCloseBottomSheet} // 바텀시트 닫기 함수 전달
        snapPoints={['80%']} // 바텀시트 80% 올라오도록 설정
        index={-1} // 초기 상태에서 바텀시트 닫힘
      />

      {/* ExerciseHistory 바텀시트 */}
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
          selectedDate={`${selectedDate}.${selectedDay}`}
          setIsImageBlurred={setIsImageBlurred}
          setIsButtonBlurred={setIsButtonBlurred}
        />
      </BottomSheet>

      {/* 하단 네비게이션 */}
      {isBottomNavVisible && <BottomNavigation />} {/* 하단 네비게이션 상태에 따라 렌더링 */}
    </SafeAreaView>
  );
}

// 버튼 스타일 함수
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