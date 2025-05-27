import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from "react";
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
import FoodLoading from "../components/FoodLoading";
import HalfCircleSkiaChart from "../components/HalfCircleSkiaChart";
import Loading from "../components/Loading";
import NutrientRing from "../components/NutrientRing";
import NutritionCalendarScreen from "./NutritionCalendarScreen";

// import { Home, User, Settings } from "lucide-react";


const screenWidth = Dimensions.get("window").width;
const viewWidth = screenWidth - 58;


const NutritionMainScreen = () => {
  
  const route = useRoute();
  const navigation = useNavigation();
  const selectedItemFromRoute = route.params?.selectedItem;
  const selectedSupplementFromRoute = route.params?.selectedsupplementItem;
  const [currentPage, setCurrentPage] = useState(0);
  const dailyCalories = 2000;
  const consumedCalories = 1800;
  const progress = consumedCalories / dailyCalories;
  const [dietImages, setDietImages] = useState([]);
  const [supplementImages, setSupplementImages] = useState([]);
  const [latestLog, setLatestLog] = useState(null);
  const [recommended, setRecommended] = useState(null); // type === MIN 기준값
  const [macroNutrients, setMacroNutrients] = useState([]);
  const [etcNutrients, setEtcNutrients] = useState([]);
  const [smallNutrients, setSmallNutrients] = useState([]);
  const calendarRef = useRef(null);
  // 캘린더에서 받아온 날짜 -> selectedDate
  const selectedDateFromRoute = route.params?.selectedDate;
  const [selectedDate, setSelectedDate] = useState(selectedDateFromRoute || moment().format("YYYY-MM-DD"));
  // 전체 로딩창
  const [isLoading, setIsLoading] = useState(true);

  // 사진분석할때 로딩창
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // 권장 칼로리 변할때
  const [calorieProgress, setCalorieProgress] = useState(0);


  const bottomSheetRef = useRef(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ['90%'], []);

  // const dateToDisplay = moment(selectedDate).format("YYYY.MM.DD");

  // selectedDate 변경 시마다 최신 날짜 문자열 계산
  const dateToDisplay = useMemo(() => moment(selectedDate).format("YYYY.MM.DD"), [selectedDate]);
  
  // 권장 칼로리 변할 때
  useEffect(() => {
    if (latestLog && recommended?.calories) {
      const progressValue = latestLog.calories / recommended.calories;
      setCalorieProgress(progressValue > 1 ? 1 : progressValue);
    }
  }, [latestLog, recommended]);

  useEffect(() => {
    (async () => {
      const savedDate = await AsyncStorage.getItem("selectedDate");
      if (savedDate) {
        setSelectedDate(savedDate);
      } else {
        const today = moment().format("YYYY-MM-DD");
        setSelectedDate(today);
        await AsyncStorage.setItem("selectedDate", today);
      }
    })();
  }, []);

  const fetchNutritionData = async () => {
    const token = await AsyncStorage.getItem("token");
    const logRes = await fetch(`http://13.209.199.97:8080/diet/nutrition/log/load`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const logData = await logRes.json();
    const lastLog = logData.find(log => log.date === selectedDate);
    setLatestLog(lastLog);

    const recRes = await fetch("http://13.209.199.97:8080/diet/nutrition/rec/load", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const recData = await recRes.json();
    const minRec = recData.find((r) => r.type === "MIN"); // 최소 권장량
    const maxRec = recData.find((r) => r.type === "MAX"); // 최대 권장량
    setRecommended(minRec);

    if (lastLog && minRec) {
      const major = ["carbohydrate", "protein", "fat"];
      const etc = ["sugar", "sodium", "dietaryFiber", "calcium"];
      const small = ["saturatedFat", "transFat", "cholesterol"];

      const buildData = (keys) =>
        keys.map((key) => {
          const intake = lastLog[key];
          const min = minRec[key];
          const max = maxRec?.[key] ?? min * 1.5;

          let status = "부족";
          let color = "#FFB546"; // 노란색 (부족)

          if (intake >= min && intake <= max) {
            status = "충분";
            color = "#26C51E"; // 초록 (충분)
          } else if (intake > max) {
            status = "과다";
            color = "#FF4646"; // 빨강 (과다)
          }

          const unit = key === "sodium" || key === "calcium" || key === "cholesterol" ? "mg" : "g";

          return {
            name:
              key === "carbohydrate" ? "탄수화물" :
              key === "protein" ? "단백질" :
              key === "fat" ? "지방" :
              key === "sugar" ? "당류" :
              key === "sodium" ? "나트륨" :
              key === "dietaryFiber" ? "식이섬유" :
              key === "calcium" ? "칼슘" :
              key === "saturatedFat" ? "포화지방" :
              key === "transFat" ? "트랜스지방" :
              key === "cholesterol" ? "콜레스테롤" : key,
            amount: `${Math.round(intake)}${unit}`,
            status,
            color,
            percent: Math.min(Math.round((intake / min) * 100), 100),
          };
        });

      setMacroNutrients(buildData(major));
      setEtcNutrients(buildData(etc));
      setSmallNutrients(buildData(small));

      const today = moment().format("YYYY-MM-DD");
      if (lastLog?.date === today && minRec?.calories) {
        try {
          await AsyncStorage.setItem("todayCalories", String(lastLog.calories));
          await AsyncStorage.setItem("todayRecommendedCalories", String(minRec.calories));
          console.log("✅ 오늘 섭취 칼로리 저장 완료:", lastLog.calories, "권장칼로리", minRec.calories);
        } catch (err) {
          console.error("❌ 오늘 칼로리 AsyncStorage 저장 실패:", err);
        }
      }
    }
  };


  const uploadAndSaveMealLog = async (localUri) => {
    try {
      setIsAnalyzing(true); 
      const token = await AsyncStorage.getItem("token");
      console.log(token)

      // 1. S3 업로드용 presigned URL 요청
      const fileName = `meal-${Date.now()}.jpg`;
      const contentType = "image/jpeg";

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
        headers: { "Key": "Content-Type", "Value": "image/jpeg"},
        body: blob,
      });

      const s3ImageUrl = presignedUrl.split("?")[0]; // 쿼리 제거 → 실제 이미지 URL
      console.log("✅ 업로드된 S3 이미지 URL:", s3ImageUrl);

      // 3. 식사 기록 저장
      setTimeout(async () => {
      try {
        const logRes = await fetch("http://13.209.199.97:8080/diet/meal/log/save", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "image",
            mealImage: s3ImageUrl,
            foodId: null,
            dateTime: `${selectedDate}T12:00:00`,
          }),
        });

        console.log("📤 식사 기록 저장 응답 상태:", logRes.status);
        if (!logRes.ok) throw new Error("식사 기록 저장 실패");

        setDietImages((prev) => [...prev, { uri: s3ImageUrl }]);
        console.log("✅ 식사 기록 저장 완료");

        await fetchMealLogs();
        await fetchNutritionData();

      } catch (logErr) {
        console.error("❌ 식사 기록 저장 실패:", logErr);
        Alert.alert("실패", "식사 기록 저장 중 오류가 발생했습니다.");
      } finally {
        setIsAnalyzing(false); // 로딩 종료
      }
    }, 1500); // ✅ 1.5초 대기

  } catch (err) {
    console.error("❌ 이미지 업로드 실패:", err);
    Alert.alert("실패", "이미지 업로드 중 오류가 발생했습니다.");
    setIsAnalyzing(false);
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

  // 날짜별로 새로 로드 
  // useEffect(() => {
  //   fetchNutritionData();
  //   fetchSupplementLogs();
  //   fetchMealLogs(); // 앱 시작 시 또는 필요한 시점에 불러오기
  // }, [selectedDate]);

  useEffect(() => {
    const loadDataOnDateChange = async () => {
      setIsLoading(true); // ✅ 날짜 바뀌면 로딩 시작
      try {
        await Promise.all([
          fetchNutritionData(),
          fetchSupplementLogs(),
          fetchMealLogs()
        ]);
      } catch (err) {
        console.error("❌ 날짜 변경 시 데이터 로드 실패:", err);
      } finally {
        setIsLoading(false); // ✅ 완료되면 로딩 종료
      }
    };

    loadDataOnDateChange();
  }, [selectedDate]);


  //섭취한 음식 띄우기
  const fetchMealLogs = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`http://13.209.199.97:8080/diet/meal/log/load`, {
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
    // console.log("식사 섭취 기록:", logs);

    const formattedSelectedDate = moment(selectedDate).format("YYYY-MM-DD");

    const imageLogs = logs?.imageMealLogs
      ?.filter((log) => {
        const date = log.mealLog?.date;
        return date && moment(date).format("YYYY-MM-DD") === formattedSelectedDate;
      })
      ?.map((log) => ({
        ...log,
        uri: log.mealImage,
        id: log.imageMealLogId,
      }));

    const searchLogs = logs?.searchMealLogs
      ?.filter((log) => {
        const date = log.mealLog?.date;
        return date && moment(date).format("YYYY-MM-DD") === formattedSelectedDate;
      })
      ?.map((log) => ({
        ...log,
        uri: log.foodImage,
      }));

    const combinedImages = [...(imageLogs || []), ...(searchLogs || [])];
    setDietImages(combinedImages);

  } catch (err) {
    console.error("❌ 식사 기록 불러오기 실패:", err);
  }
};

  
  // 섭취한 영양제 띄우기
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
      console.log("영양제 섭취 기록 가져오기 성공",logs);

      const formattedSelectedDate = moment(selectedDate).format("YYYY-MM-DD");

      const filtered = logs
      .filter((log) => {
        const logDate = moment(log.date).format("YYYY-MM-DD");
        return logDate === formattedSelectedDate;
      })
      .filter((log) => log.supplementData?.supplementImage)
      .map((log) => ({
        ...log,
        uri: log.supplementData.supplementImage,
      }));

    setSupplementImages(filtered);

    } catch (err) {
      console.error("❌ 영양제 섭취 기록 불러오기 실패:", err);
    }
  };

  // 🔹 2. useEffect에서 최초 1번 실행
  // useEffect(() => {
  //   fetchNutritionData();
  //   fetchMealLogs();
  //   fetchSupplementLogs();
  // }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchNutritionData(),
          fetchMealLogs(),
          fetchSupplementLogs()
        ]);
      } catch (error) {
        console.error("초기 데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false); // 세 가지 모두 로드 완료되면 로딩 종료
      }
    };

    loadInitialData();
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

  const handleOpen = () => {
      bottomSheetRef.current?.expand();
  };

  const handleDateSelect = (date) => {
      setSelectedDate(date);
      bottomSheetRef.current?.close();
  };

  


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F3F3" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          {/* 캘린더 */}
            <TouchableOpacity onPress={handleOpen}>
              <AntDesign style={styles.calendarIcon} name="calendar" size={24} color="black" />
            </TouchableOpacity>
          <Text style={styles.dateText}>{dateToDisplay}</Text>
        </View>

        <View style={styles.processContainerShadow}>
        <LinearGradient
          colors={["#FFFFFF", "#E9E9E9"]}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={styles.processContainer}
        >
           <HalfCircleSkiaChart
              latestLog={latestLog}
              progress={calorieProgress} 
              // progress={
              //   latestLog && recommended?.calories
              //     ? latestLog.calories / recommended.calories
              //     : 0
              // }
              size={280}
              targetCalories={
                recommended?.calories ? Math.round(recommended.calories) : 2000
              }
            />

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
                {macroNutrients.map((item, index) => {
                  return (
                    <NutrientRing
                      key={index}
                      percent={item.percent}
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
                  return (
                    <NutrientRing
                      key={index}
                      percent={item.percent}
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
                  return (
                    <NutrientRing
                      key={index}
                      percent={item.percent}
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

          <TouchableOpacity style={styles.roundButton} 
            onPress={() => navigation.navigate("DietRegistration", {
              selectedDate: selectedDate,
            })}>
            <Ionicons name="fast-food-outline" size={30} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.roundButton} 
            onPress={() => navigation.navigate("VitaminRegistion", {
              selectedDate: selectedDate,
            })}>
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
              {/* 백과 조율이 필요 */}
              <TouchableOpacity
                  onPress={async () => {
                    console.log("🧪 삭제 대상 객체:", item);         // ← 전체 객체 확인
                    console.log("🔑 삭제 대상 logId:", item.mealLog.mealId);
                    try {
                      const token = await AsyncStorage.getItem("token");
                      // 수정 필요 api 코드
                      const res = await fetch(`http://13.209.199.97:8080/diet/meal/log/delete?log_id=${item.mealLog.mealId}`, {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });

                      const resultText = await res.text();
                      console.log("📡 서버 응답:", res.status, resultText);

                      if (!res.ok) throw new Error("삭제 실패");

                      // setDietImages((prev) =>
                      //   prev.filter((img) => img.searchMealLogId !== item.searchMealLogId && img.id !== item.id)
                      // );

                      // console.log("✅ 식사기록 삭제 성공:", item.mealLog.mealId);
                      fetchMealLogs();
                      fetchNutritionData();
                    } catch (err) {
                      console.error("❌ 식사기록 삭제 실패:", err);
                    }
                  }}
                  style={styles.deleteButton}
                >
                  <Ionicons name="remove-circle" size={30} color="red" />
                </TouchableOpacity>
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
              <TouchableOpacity
                  onPress={async () => {
                    // console.log("🧪 삭제 요청 영양제 객체:", item);
                    // console.log("🧪 삭제 요청 영양제 supplementLogId:", item.supplementLogId);
                    
                    try {
                      const token = await AsyncStorage.getItem("token");
                      // 수정 필요 api 코드
                      const res = await fetch(`http://13.209.199.97:8080/diet/sup/log/delete?log_id=${item.supplementLogId}`, {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });

                      const resultText = await res.text();
                      console.log("📡 서버 응답:", res.status, resultText);

                      if (!res.ok) throw new Error("삭제 실패");

                      // 성공 시 프론트에서 삭제 반영
                      // setFavoriteIngredients(
                      //   favoriteIngredients.filter(i => i.id !== item.id)
                      // );

                      // console.log("✅ 영양제 기록 삭제 성공:", item.supplementLogId);
                      fetchSupplementLogs();
                      fetchNutritionData();
                    } catch (err) {
                      console.error("❌ 영양제 기록 삭제 실패:", err);
                    }
                  }}
                  style={styles.deleteButton}
                >
                  <Ionicons name="remove-circle" size={30} color="red" />
                </TouchableOpacity>
              <Image source={item} style={styles.mealPhoto} />
            </View>
          )}
        />
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          onChange={(index) => {
            // index가 -1이면 닫힘 상태
            setIsBottomSheetOpen(index !== -1);
          }}
          backgroundStyle={{ borderTopLeftRadius: 25, borderTopRightRadius: 25, backgroundColor: "#fff" }}
        >
          {/* <NutritionCalendarScreen onSelectDate={handleDateSelect} /> */}
          <NutritionCalendarScreen
            onSelectDate={async (date) => {
              console.log("선택된 날짜:", date);
              setSelectedDate(date);
              await AsyncStorage.setItem("selectedDate", date);
              bottomSheetRef.current?.close();
            }}
          />
        </BottomSheet>
      </ScrollView>
      {!isBottomSheetOpen && <BottomNavigation />}
      {/* 로딩 */}
      {isAnalyzing && <FoodLoading/>}
      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

// if (isLoading) {
//     return <Loading />; // 모든 데이터 로드 전까지 로딩 화면
//   }

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
  deleteButton: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 25,
    zIndex: 1,
    transform: [{ scale: 0.5 }], 
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