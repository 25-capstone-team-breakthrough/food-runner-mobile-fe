import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const NutritionCalendarScreen = ({ visible }) => {
  const navigation = useNavigation();
  const translateY = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
  
      if (translationY > 50 || velocityY > 2) { 
        // 🔹 애니메이션으로 서서히 아래로 이동 후 페이지 닫기
        Animated.timing(translateY, {
          toValue: 800, // 화면 아래로 이동
          duration: 300, // 0.3초 동안 이동
          useNativeDriver: true,
        }).start(() => {
          navigation.goBack(); // 애니메이션이 끝난 후 이동
        });
      } else {
        // 🔹 원래 위치로 복귀
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => navigation.goBack()} // 🔹 안드로이드 뒤로가기 대응
    >
      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}> 
          {/* X 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>

          {/* 달력 */}
          <Text style={styles.dateText}>2025.01</Text>
          <View style={styles.calendarContainer}>
            <Calendar
              current={"2025-01-01"}
              markedDates={{ "2025-01-23": { selected: true, selectedColor: "yellow" } }}
            />
          </View>

          {/* 그래프 */}
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: ["01.2", "01.2", "01.2", "01.2", "01.2", "01.2"],
                datasets: [{ data: [1, 2, 0.5, 3, 2, 1] }],
              }}
              width={screenWidth - 40}
              height={150}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 10 },
              }}
              bezier
            />
          </View>
          
          {/* 선택하기 버튼 */}
          <TouchableOpacity style={styles.selectButton} onPress={() => navigation.goBack()}>
            <Text style={styles.selectButtonText}>선택하기</Text>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  dateText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  calendarContainer: {
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  chartContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  selectButton: {
    backgroundColor: "yellow",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NutritionCalendarScreen;
