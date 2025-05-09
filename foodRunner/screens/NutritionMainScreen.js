import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavigation from "../components/BottomNavigation";
import HalfCircleSkiaChart from "../components/HalfCircleSkiaChart";
import NutrientRing from "../components/NutrientRing";

// import { Home, User, Settings } from "lucide-react";


const screenWidth = Dimensions.get("window").width;
const viewWidth = screenWidth - 58;


const NutritionMainScreen = () => {
  
  const route = useRoute();
  const navigation = useNavigation();
  const selectedItemFromRoute = route.params?.selectedItem;
  const selectedSupplementFromRoute = route.params?.selectedsupplementItem;
  const selectedDate  = route.params?.selectedDate;

  const dateToDisplay = selectedDate || moment().format("YYYY.MM.DD")

  const [currentPage, setCurrentPage] = useState(0);
  const dailyCalories = 2000;
  const consumedCalories = 1800;
  const progress = consumedCalories / dailyCalories;

  const nutrients = [
    { name: "탄수화물", status: "충분", amount: "100g", color: "#26C51E" },
    { name: "단백질", status: "부족", amount: "10g", color: "#FF4646"  },
    { name: "지방", status: "부족", amount: "0g", color: "#FF4646" },
  ];
  
  const etcNutrients = [
    { name: "당류", status: "충분", amount: "15g", color: "#26C51E" },
    { name: "나트륨", status: "부족", amount: "800mg", color: "#FF4646" },
    { name: "식이섬유", status: "충분", amount: "6g", color: "#26C51E" },
    { name: "칼슘", status: "충분", amount: "200mg", color: "#26C51E" },
  ];

  const smallNutrients = [
    { name: "포화지방", amount: "5g", status: "부족", color: "#FF4646" },
    { name: "트랜스지방", amount: "0g", status: "부족", color: "#FF4646" },
    { name: "콜레스테롤", amount: "80mg", status: "충분", color: "#26C51E" },
  ];

  const [dietImages, setDietImages] = useState([]);
  const [supplementImages, setSupplementImages] = useState([]);

  useEffect(() => {
    (async () => {
      
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  
      if (
        galleryPermission.status !== "granted" ||
        cameraPermission.status !== "granted"
      ) {
        Alert.alert("권한 필요", "카메라 및 갤러리 접근을 허용해주세요.");
        return;
      }

      if (selectedItemFromRoute?.image) {
        setDietImages((prev) => [...prev, selectedItemFromRoute.image]);
      }

      if (selectedSupplementFromRoute?.image) {
        setSupplementImages((prev) => [...prev, selectedSupplementFromRoute.image]);
      }
    })();
  }, [selectedItemFromRoute, selectedSupplementFromRoute]);
  
  

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setDietImages((prev) => [...prev, { uri }]);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setDietImages((prev) => [...prev, { uri }]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F3F3" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("NutritionCalendar")}> 
            <AntDesign name="calendar" size={20} color="black" style={styles.calendarIcon} />
          </TouchableOpacity>
          <Text style={styles.dateText}>{dateToDisplay}</Text>
        </View>

        <View style={styles.processContainerShadow}>
        <LinearGradient
          colors={["#FFFFFF", "#E9E9E9"]}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={styles.processContainer}
        >
           <HalfCircleSkiaChart progress={progress} size={280} />

          <View style={styles.separator} />

          <ScrollView
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setCurrentPage(page);
            }}
            scrollEventThrottle={16}
          >
            <View style={{ width: viewWidth, alignItems: "center" }}>
              <Text style={styles.threeMacroNutrientsText}>3대 주요 영양소</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                {nutrients.map((item, index) => {
                  let percent = 0;
                  if (item.status === "충분") percent = 80;
                  if (item.status === "부족") percent = 20;
                  return (
                    <NutrientRing
                      key={index}
                      percent={percent}
                      color={item.color}
                      status={item.status}
                      amount={item.amount}
                      label={item.name}
                    />
                  );
                })}
              </View>
            </View>
            
            <View style={{ width: viewWidth, alignItems: "center" }}>
              <Text style={styles.threeMacroNutrientsText}>미량 영양소</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
              {etcNutrients.map((item, index) => {
                  let percent = 0;
                  if (item.status === "충분") percent = 80;
                  if (item.status === "부족") percent = 20;
                  return (
                    <NutrientRing
                      key={index}
                      percent={percent}
                      color={item.color}
                      status={item.status}
                      amount={item.amount}
                      label={item.name}
                    />
                  );
                })}
              </View>
            </View>

            <View style={{ width: viewWidth, alignItems: "center" }}>
              <Text style={styles.threeMacroNutrientsText}>미량 영양소</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
              {smallNutrients.map((item, index) => {
                  let percent = 0;
                  if (item.status === "충분") percent = 80;
                  if (item.status === "부족") percent = 20;
                  return (
                    <NutrientRing
                      key={index}
                      percent={percent}
                      color={item.color}
                      status={item.status}
                      amount={item.amount}
                      label={item.name}
                    />
                  );
                })}
              </View>
            </View>
          </ScrollView>
          <View style={{ position: "relative"}}>
          <View style={{ position: "absolute",bottom: -10, left:0, right:0, flexDirection: "row", justifyContent: "center"}}>
            {[0, 1, 2].map((i) => (
              <Text key={i} style={{ fontSize: 8, marginHorizontal: 5, color: currentPage === i ? "#333" : "#ccc" }}>
                {currentPage === i ? "●" : "○"}
              </Text>
            ))}
          </View>
          </View>
        </LinearGradient>
        </View>

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
        {/* 나중에 식단사진 넣을때 id로 넣어야 됨.  */}
        <FlatList
          data={dietImages}
          style={styles.mealList}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
          renderItem={({ item }) => (
            <View style={styles.mealList}>
              <Image source={item} style={styles.mealPhoto}/>
            </View>
          )}
        />

          
        <View style={styles.photoSeparator} />
        <Text style={styles.photoText}>영양제</Text>
        <FlatList
          data={supplementImages}
          style={styles.mealList}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
          renderItem={({ item }) => (
            <View style={styles.mealList}>
              <Image source={item} style={styles.mealPhoto} />
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
    marginTop: 10,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  processContainerShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginVertical: 5,
    alignSelf: "center",
  },
  threeMacroNutrientsText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#363636",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
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
    marginLeft: 18,
    marginRight: 8,
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
