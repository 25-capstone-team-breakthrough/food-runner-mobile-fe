import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import moment from 'moment';
import { useEffect, useState } from "react";
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

  const uploadAndSaveMealLog = async (localUri) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token)

      // 1. S3 업로드용 presigned URL 요청
      const fileName = `meal-${Date.now()}.jpg`;
      const contentType = "image";

      const urlRes = await fetch(
        `http://13.209.199.97:8080/diet/meal/getS3URL?fileName=${fileName}&contentType=${contentType}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(urlRes.status)
      if (!urlRes.ok) throw new Error("S3 URL 요청 실패");
      const presignedUrl = await urlRes.text();

      // 2. 이미지 S3로 업로드
      const imageRes = await fetch(localUri);
      const blob = await imageRes.blob();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": "image" },
        body: blob,
      });

      const s3ImageUrl = presignedUrl.split("?")[0]; // 쿼리 제거 → 실제 이미지 URL

      // 3. 식사 기록 저장
      const logRes = await fetch("http://13.209.199.97:8080/diet/meal/log/save", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "image", // 또는 다른 값
          mealImage: s3ImageUrl,
          foodId: null, // 실제 음식 ID 필요. route.params?.selectedItem?.foodId 등을 활용
          dateTime: new Date().toISOString(),
        }),
      });

      console.log("응답 상태:", urlRes.status);
      if (!logRes.ok) throw new Error("식사 기록 저장 실패");
      console.log("presigned 요청 상태코드:", urlRes.status);
      const errorText = await urlRes.text();
      console.log("에러 응답 내용:", errorText);

      // 4. FlatList에 추가
      setDietImages((prev) => [...prev, { uri: s3ImageUrl }]);

    } catch (err) {
      console.error("❌ 이미지 업로드 또는 저장 실패:", err);
      Alert.alert("실패", "이미지 저장 중 오류가 발생했습니다.");
    }
  };


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

  // 섭취한 음식 띄우기
  useEffect(() => {
    fetchMealLogs(); // 앱 시작 시 또는 필요한 시점에 불러오기
  }, []);

  const fetchMealLogs = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch("http://13.209.199.97:8080/diet/meal/log/load", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("식사 기록 불러오기 실패: " + res.status);
    }

    const logs = await res.json();
    console.log("식사 기록 가져오기 성공");
    console.log("식사 섭취 기록:", logs);

    const imageLogs = logs?.imageMealLogs
      ?.map((log) => log.mealImage)
      ?.filter(Boolean)
      ?.map((url) => ({ uri: url }));


    // mealImage 속성을 가진 배열로 변환
    const searchLogs = logs?.searchMealLogs
      ?.map((log) => log.foodImage)
      ?.filter(Boolean)
      ?.map((url) => ({ uri: url }));

    const combinedImages = [...(imageLogs || []), ...(searchLogs || [])];

    setDietImages(combinedImages);


  } catch (err) {
    console.error("❌ 식사 기록 불러오기 실패:", err);
  }
};

  
  // 섭취한 영양제 띄우기
  useEffect(() => {
    const fetchSupplementLogs = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch("http://13.209.199.97:8080/diet/sup/log/load", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("섭취 기록 불러오기 실패: " + res.status);
        }

        const logs = await res.json();
        console.log("영양제 섭취 기록 가져오기 성공")
        // console.log("✔️ 영양제 섭취 기록:", logs);

        // 이미지 리스트 구성
        const images = logs
          .map((log) => log.supplementData?.supplementImage) 
          .filter(Boolean) // null, undefined 제거
          .map((url) => ({ uri: url })); // FlatList에 쓸 형태로 가공

        setSupplementImages(images);
      } catch (err) {
        console.error("❌ 영양제 섭취 기록 불러오기 실패:", err);
      }
    };

    fetchSupplementLogs();
  }, []);

  
  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      uploadAndSaveMealLog(uri); 
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      uploadAndSaveMealLog(uri);
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