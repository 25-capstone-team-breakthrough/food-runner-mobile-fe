import React, { useEffect, useState } from "react";
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
import { AntDesign } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
// import { Home, User, Settings } from "lucide-react";


const screenWidth = Dimensions.get("window").width;

// 반달형 그래프용 함수
const describeArc = (x, y, radius, startAngle, endAngle) => {
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
};

const HalfCircleChart = ({ progress = 0.9, size = 180, strokeWidth = 20 }) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const endAngle = 180 * progress;

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Svg width={size} height={size / 2}>
        <Path
          d={describeArc(center, center, radius, 180, 0)}
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Path
          d={describeArc(center, center, radius, 180, 180 - endAngle)}
          stroke="#CDFF00"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ position: "absolute", top: size * 0.15, alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>{Math.round(progress * 2000)}</Text>
        <Text style={{ fontSize: 14, color: "#777" }}>권장 2,000kcal</Text>
      </View>
    </View>
  );
};

const NutritionMainScreen = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const dailyCalories = 2000;
  const consumedCalories = 1800;
  const progress = consumedCalories / dailyCalories;

  const nutrients = [
    { name: "탄수화물", status: "충분", amount: "100g", color: "green" },
    { name: "단백질", status: "부족", amount: "10g", color: "red" },
    { name: "지방", status: "부족", amount: "0g", color: "gray" },
  ];

  const meals = [
    { id: 1, name: "스파게티", image: require("../assets/dobuScb.png") },
    { id: 2, name: "스파게티", image: require("../assets/salad.png") },
    { id: 3, name: "스파게티", image: require("../assets/salmonAvocado.png") },
    { id: 4, name: "스파게티", image: require("../assets/dobuScb.png") },
    { id: 5, name: "스파게티", image: require("../assets/salad.png") },
    { id: 6, name: "스파게티", image: require("../assets/salmonAvocado.png") },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted" || status !== "granted") {
        Alert.alert("권한 필요", "카메라 및 갤러리 접근을 허용해주세요.");
      }
    })();
  }, []);

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets?.length > 0) {
      console.log("Captured Image:", result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets?.length > 0) {
      console.log("Selected Image:", result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F3F3" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("NutritionCalendar")}> 
            <AntDesign name="calendar" size={20} color="black" style={styles.calendarIcon} />
          </TouchableOpacity>
          <Text style={styles.dateText}>2025.01.21</Text>
        </View>

        <LinearGradient
          colors={["#FFFFFF", "#E9E9E9"]}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={styles.processContainer}
        >
          <HalfCircleChart progress={progress} />

          <View style={styles.separator} />

          <ScrollView
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setCurrentPage(page);
            }}
            scrollEventThrottle={16}
          >
            <View style={{ width: screenWidth, alignItems: "center" }}>
              <Text style={styles.threeMacroNutrientsText}>3대 주요 영양소</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                {nutrients.map((item, index) => (
                  <View key={index} style={{ alignItems: "center" }}>
                    <Text style={{ color: item.color, fontWeight: "bold" }}>{item.status}</Text>
                    <Text>{item.amount}</Text>
                    <Text>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ width: screenWidth, alignItems: "center" }}>
              <Text style={styles.threeMacroNutrientsText}>기타 주요 영양소</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                {[{ name: "당류", amount: "15g" }, { name: "나트륨", amount: "800mg" }, { name: "식이섬유", amount: "6g" }, { name: "칼슘", amount: "200mg" }].map((item, i) => (
                  <View key={i} style={{ alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", color: "#666" }}>{item.amount}</Text>
                    <Text>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ width: screenWidth, alignItems: "center" }}>
              <Text style={styles.threeMacroNutrientsText}>미량 영양소</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                {[{ name: "포화지방", amount: "5g" }, { name: "트랜스지방", amount: "0g" }, { name: "콜레스테롤", amount: "80mg" }].map((item, i) => (
                  <View key={i} style={{ alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", color: "#666" }}>{item.amount}</Text>
                    <Text>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
            {[0, 1, 2].map((i) => (
              <Text key={i} style={{ fontSize: 8, marginHorizontal: 5, color: currentPage === i ? "#333" : "#ccc" }}>
                {currentPage === i ? "●" : "○"}
              </Text>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.roundButton} onPress={openCamera}>
            <Ionicons name="camera-outline" size={30} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.roundButton} onPress={openGallery}>
            <Ionicons name="image-outline" size={30} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.roundButton} onPress={() => navigation.navigate("DietRegistration")}>
            <Ionicons name="fast-food-outline" size={30} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.roundButton} onPress={() => navigation.navigate("VitaminRegistion")}>
            <MaterialCommunityIcons name="pill" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.photoText}>식사</Text>

        <FlatList
          data={meals}
          style={styles.mealList}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false} 
          renderItem={({ item }) => (
            <View style={styles.mealList}>
              <Image source={item.image} style={styles.mealPhoto} />
              {/* <Text>{item.name}</Text> */}
            </View>
          )}
        />

        <View style={styles.photoSeparator} />
        <Text style={styles.photoText}>영양제</Text>
        <FlatList
          data={meals}
          style={styles.mealList}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false} 
          renderItem={({ item }) => (
            <View style={styles.mealList}>
              <Image source={item.image} style={styles.mealPhoto} />
              {/* <Text>{item.name}</Text> */}
            </View>
          )}
        />
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = {
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "85%",
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 5,
    marginLeft: 30,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  calendarIcon: {
    marginLeft: 13,
    marginRight: 70,
  },
  dateText: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "500",
  },
  processContainer: {
    alignSelf: "center",
    width: "85%",
    height: 350,
    borderRadius: 20,
    marginTop: 5,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingBottom: 20,
  },
  consumedCaloriesText: {
    fontSize: 35,
    fontWeight: "500",
    alignSelf: "center",
  },
  dailyCaloriesText: {
    fontSize: 17,
    fontWeight: "500",
    alignSelf: "center",
  },
  separator: {
    height: 1,
    width: "92%",
    backgroundColor: "#8A8A8A",
    marginVertical: 15,
    alignSelf: "center",
  },
  threeMacroNutrientsText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#363636",
    alignSelf: "center",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 30,
    marginBottom: 28,
  },
  roundButton: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  photoText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#363636",
    marginTop: 5,
    marginLeft: 40,
    marginBottom: 5,
  },
  mealList: {
    marginTop: 5,
    marginLeft: 15,
  },
  mealPhoto: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 20,
  },
  photoSeparator: {
    height: 1,
    width: "85%",
    backgroundColor: "#DDDDDD",
    marginVertical: 15,
    marginTop: 3,
    alignSelf: "center",
  },
};

export default NutritionMainScreen;
