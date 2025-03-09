import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { AntDesign } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const NutritionMainScreen = () => {
  const navigation = useNavigation();
  const dailyCalories = 2000;
  const consumedCalories = 1800;
  const progress = consumedCalories / dailyCalories;

  const chartData = { data: [progress] };

  const nutrients = [
    { name: "탄수화물", status: "충분", amount: "100g", color: "green" },
    { name: "단백질", status: "부족", amount: "10g", color: "red" },
    { name: "지방", status: "부족", amount: "0g", color: "gray" },
  ];

  const meals = [{ id: 1, name: "스파게티", image: require("../assets/logo.png") }];

  // 📌 권한 요청 useEffect
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

      console.log("📸 Camera Permission:", cameraStatus);
      console.log("🖼️ Gallery Permission:", status);

      if (cameraStatus !== "granted" || status !== "granted") {
        Alert.alert("권한 필요", "카메라 및 갤러리 접근을 허용해주세요.");
      }
    })();
  }, []);

  // 📌 카메라 실행 함수
  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    console.log("📸 Camera Result:", result);

    if (!result.canceled && result.assets?.length > 0) {
      console.log("Captured Image:", result.assets[0].uri);
    } else {
      console.log("카메라 취소됨");
    }
  };

  // 📌 갤러리 실행 함수
  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    console.log("🖼️ Gallery Result:", result);

    if (!result.canceled && result.assets?.length > 0) {
      console.log("Selected Image:", result.assets[0].uri);
    } else {
      console.log("갤러리 취소됨");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 🔹 날짜 & 달력 아이콘 */}
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("NutritionCalendar")}>
            <AntDesign name="calendar" size={20} color="black" style={styles.calendarIcon} />
          </TouchableOpacity>
          <Text style={styles.dateText}>2025.01.21</Text>
        </View>

        {/* 🔹 칼로리 Progress Chart */}
        <View style={{ alignItems: "center" }}>
          <ProgressChart
            data={chartData}
            width={screenWidth * 0.6}
            height={150}
            strokeWidth={10}
            radius={50}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
            }}
            hideLegend={true}
          />
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>{consumedCalories}</Text>
          <Text style={{ color: "gray" }}>권장 {dailyCalories}kcal</Text>
        </View>

        {/* 🔹 3대 주요 영양소 */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
          {nutrients.map((item, index) => (
            <View key={index} style={{ alignItems: "center" }}>
              <Text style={{ color: item.color, fontWeight: "bold" }}>{item.status}</Text>
              <Text>{item.amount}</Text>
              <Text>{item.name}</Text>
            </View>
          ))}
        </View>

        {/* 🔹 버튼 4개 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.roundButton} onPress={openCamera}>
            <Text>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton} onPress={openGallery}>
            <Text>🖼️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton} onPress={() => navigation.navigate("DietRegistration")}>
            <Text>➡️1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton} onPress={() => navigation.navigate("VitaminRegistion")}>
            <Text>➡️2</Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 식사 목록 */}
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          renderItem={({ item }) => (
            <View style={{ alignItems: "center", margin: 10 }}>
              <Image source={item.image} style={{ width: 80, height: 80, borderRadius: 10 }} />
              <Text>{item.name}</Text>
            </View>
          )}
        />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  calendarIcon: {
    marginRight: 8, // 아이콘과 날짜 사이 간격
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  roundButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default NutritionMainScreen;
