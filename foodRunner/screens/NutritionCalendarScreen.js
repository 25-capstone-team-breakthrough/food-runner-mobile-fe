import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View
} from "react-native";
import { Calendar } from "react-native-calendars";
import { LineChart } from "react-native-chart-kit";
import RegisterButton from "../components/RegisterButton";

const screenWidth = Dimensions.get("window").width;

const NutritionCalendarScreen = ({ onSelectDate }) => {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [logData, setLogData] = useState([]);
  // 오늘 날짜 표시
    const today = moment().format("YYYY-MM-DD");
    

    // 영양 정보 가져오기
    useEffect(() => {
        const fetchLog = async () => {
            try {
                const token = await AsyncStorage.getItem("token"); // 토큰 가져오기
                const response = await fetch("http://13.209.199.97:8080/diet/nutrition/log/load", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("API 요청 실패");
                }

                const data = await response.json();
                console.log("일자별 칼로리 가져오기",data)
                setLogData(data);
            } catch (error) {
                console.error("영양 로그 불러오기 오류:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLog();
    }, []);

    useEffect(() => {
        const today = moment().format("YYYY-MM-DD");
        setSelectedDate(today);
    }, []);

    const handleDateChange = (day) => {
        setSelectedDate(day.dateString);
    };

    const getWeekDates = (centerDate) => {
        const startOfWeek = moment(centerDate).startOf("isoWeek");
        return Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, "days"));
    };

    const weekDates = getWeekDates(selectedDate);
    const calorieData = weekDates.map((date) => {
        const entry = logData.find((item) => item.date === date.format("YYYY-MM-DD"));
        return entry ? entry.calories : 0;          
    });
    // const calorieData = weekDates.map((d) => monthlyCalorieData[d.format("YYYY-MM-DD")] || 0);
    const highlightIndex = weekDates.findIndex((d) => d.format("YYYY-MM-DD") === selectedDate);

    // const labels = weekDates.map((d, i) => {
    //     if (i === highlightIndex) {
    //         const day = d.format("DD");
    //         return `\u25CF${day}`;
    //     }
    //     return d.format("DD");
    // });

    const labels = weekDates.map((d, i) => {
      const day = d.format("DD");
      return i === highlightIndex ? `${day}` : day; // ✅ 빈 원 이모지로 감싸기
    });
    // NutritionCalendarScreen 내부
    const handleSelect = () => {
        if (onSelectDate) {
            onSelectDate(selectedDate);  // 부모에 전달 (닫기 + 이동은 부모가 처리)
        }
    };

    const chartConfig = (highlightIndex) => ({
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForDots: {
            r: "4",
            strokeWidth: "1",
            stroke: "#ccc",
            fill: "#E1FF01",
        },
        propsForBackgroundLines: {
            stroke: "#ddd",
            strokeDasharray: "",
            strokeWidth: 1,
        },
        formatYLabel: (y) => {
            const rounded = Math.round(Number(y));
            if (rounded === 1000 || rounded === 2000 || rounded === 3000) {
                return `${rounded}kcal`;
            }
            return "";
        },
    });

    // `logData`로부터 데이터가 존재하는 날짜 추출
    // 정보있는거 캘린더에 표시
    const marked = logData.reduce((acc, item) => {
      const date = item.date;
      acc[date] = {
        ...acc[date],
        marked: true,
        dotColor: "#26C51E",
      };
      return acc;
    }, {});

  // 선택된 날짜는 항상 덮어쓰기
  marked[selectedDate] = {
    ...(marked[selectedDate] || {}),
    selected: true,
    selectedColor: "#E1FF01",
    disableTouchEvent: true,
  };

  // 오늘 날짜는 커스텀 스타일 (비어 있는 원)
  if (today !== selectedDate) {
    marked[today] = {
      ...(marked[today] || {}),
      customStyles: {
        container: {
          borderWidth: 1.5,
          borderColor: "#E1FF01",
          borderRadius: 20,
        },
        text: {
          color: "#000",
        },
      },
    };
  }

    return (
      <View style={styles.container}>
        <View style={styles.calendarWrapper}>
          <Calendar
            onDayPress={handleDateChange}
            markedDates={marked}
            markingType="custom"
          /* <Calendar
            onDayPress={handleDateChange}
            markedDates={{
              [selectedDate]: {
                  selected: true,
                  selectedColor: "#E1FF01",
                  disableTouchEvent: true,
              },
            }} */
            theme={{
              selectedDayBackgroundColor: "#E1FF01",
              selectedDayTextColor: "#000",
              todayTextColor: "#000",
              arrowColor: "#000",
              textSectionTitleColor: "#000",
              dayTextColor: "#000",
            }}
          />
        </View>
        
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: calorieData,
                color: () => "#000",
                strokeWidth: 1,
              },
            ],
            yAxisSuffix: "",
            yAxisInterval: 1,
          }}
          width={screenWidth - 40}
          height={160}
          chartConfig={chartConfig(highlightIndex)}
          withShadow={false}
          withVerticalLines={false}      // ✅ 세로선 제거
          withHorizontalLines={true}     // ✅ 가로선 유지 (원하는 경우)
          withInnerLines={true}          // ✅ 내부선은 유지
          withOuterLines={true}          // ✅ Y축 테두리 포함
          fromZero
          segments={3}
          yLabelsOffset={10}
          yAxisMin={1000}
          yAxisMax={3000}
          style={styles.chart}
        />

        

        <RegisterButton 
          onPress={handleSelect} 
          title="선택하기"
          style={styles.selectButton}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    // overflow: "visible",
  },
  calendarWrapper: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
    marginTop: -180,
    width: screenWidth - 40,
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
    marginRight: 15,
    // marginBottom: 20,
    right: 15,
    // bottom: 15,
  },
  selectButton: {
    backgroundColor: "#E1FF01",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    // marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default NutritionCalendarScreen;