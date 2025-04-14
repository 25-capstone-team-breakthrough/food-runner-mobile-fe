import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// 이번 달 칼로리 데이터 생성 (1일부터 말일까지 랜덤값으로 예시)
const generateMonthlyData = () => {
    const data = {};
    const startOfMonth = moment().startOf("month");
    const daysInMonth = moment().daysInMonth();
    for (let i = 0; i < daysInMonth; i++) {
        const date = startOfMonth.clone().add(i, "days").format("YYYY-MM-DD");
        data[date] = Math.floor(Math.random() * 1000) + 1500; // 1500~2500 사이 랜덤 칼로리
    }
    return data;
};

const monthlyCalorieData = generateMonthlyData();

const NutritionCalendarScreen = () => {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState("");

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
    const calorieData = weekDates.map((d) => monthlyCalorieData[d.format("YYYY-MM-DD")] || 0);
    const highlightIndex = weekDates.findIndex((d) => d.format("YYYY-MM-DD") === selectedDate);

    const labels = weekDates.map((d, i) => {
        if (i === highlightIndex) {
            const day = d.format("DD");
            return `\u25CF${day}`; // ● + 일자
        }
        return d.format("DD");
    });

    const handleSelect = () => {
        navigation.navigate("PreviousScreen", { selectedDate });
    };

    return (
        <View style={styles.container}>
            <View style={styles.calendarWrapper}>
                <Calendar
                    onDayPress={handleDateChange}
                    markedDates={{
                        [selectedDate]: {
                            selected: true,
                            selectedColor: "#E1FF01",
                            disableTouchEvent: true,
                        },
                    }}
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
                            strokeWidth: 2,
                        },
                    ],
                    yAxisSuffix: "",
                    yAxisInterval: 1,
                }}
                width={screenWidth - 40}
                height={180}
                chartConfig={chartConfig(highlightIndex)}
                withShadow={false}
                bezier={false}
                fromZero
                segments={3}
                yLabelsOffset={10}
                style={styles.chart}
                yAxisMin={1000}
                yAxisMax={3000}
            />

            <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelect}
            >
                <Text style={styles.selectText}>선택하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const chartConfig = (highlightIndex) => ({
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
        r: "6",
        strokeWidth: "4",
        stroke: "#ffff66",
        fill: "#E1FF01",
    },
    propsForBackgroundLines: {
        stroke: "#ddd",
    },
    formatYLabel: (y) => {
        const rounded = Math.round(Number(y));
        return [1000, 2000, 3000].includes(rounded) ? `${rounded}kcal` : "";
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
    },
    calendarWrapper: {
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 20,
        marginTop: 20,
        width: screenWidth - 40,
    },
    chart: {
        marginVertical: 10,
        borderRadius: 16,
    },
    selectButton: {
        backgroundColor: "#E1FF01",
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    selectText: {
        fontSize: 18,
        color: "#000",
        fontWeight: "bold",
    },
});

export default NutritionCalendarScreen;