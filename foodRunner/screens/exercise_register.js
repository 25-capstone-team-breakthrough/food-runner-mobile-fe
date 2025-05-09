import React, { useState, useMemo, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Entypo } from "@expo/vector-icons";
import exerciseData from '../assets/ExerciseData.json';
import { ExerciseContext } from "../context/ExerciseContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ExerciseRegister({ sheetRef, onClose }) {
  const [exerciseName, setExerciseName] = useState("");
  const [favorites, setFavorites] = useState({});
  const [exerciseList, setExerciseList] = useState([]);
  const [setData, setSetData] = useState([]);
  const [cardioData, setCardioData] = useState({ distance: "", duration: "", pace: "" });
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentPage, setCurrentPage] = useState("exerciseList");

  const { addExercise } = useContext(ExerciseContext);
  const snapPoints = useMemo(() => ["80%"], []);
  
  useEffect(() => {
    const cleaned = exerciseData.map((row) => ({
      ExerciseId: row.ExerciseId, // ← 여기 유지
      name: row.ExerciseName?.trim(),
      target: row.ExerciseTarget?.replace(/#/g, "").trim() || "기타",
      type: row.ExerciseType?.trim()
    }));
    setExerciseList(cleaned);
  }, []);
  

  const handleSearchChange = (text) => setExerciseName(text);

  const toggleFavorite = async (exercise) => {
    const exerciseId = exercise.ExerciseId;
    const token = await AsyncStorage.getItem("token");
  
    if (!token) {
      console.error("❗토큰 없음 - 로그인 확인 필요");
      return;
    }
  
    const isFavorited = favorites[exerciseId];
  
    // 👉 UI를 먼저 업데이트 (Optimistic UI)
    setFavorites((prev) => ({
      ...prev,
      [exerciseId]: !isFavorited,
    }));
  
    try {
      if (isFavorited) {
        // 삭제 요청
        await axios.delete(
          `http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/exercise/remove/${exerciseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // 추가 요청
        const res = await axios.post(
          `http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/exercise/favoriteAdd`,
          { exerciseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ 즐겨찾기 추가 완료:", res.data); // ← 이 줄!
      }
    } catch (err) {
      console.error("❌ 즐겨찾기 요청 실패:", err.response?.data || err.message);
  
      // ❗ 실패 시 원래 상태로 롤백
      setFavorites((prev) => ({
        ...prev,
        [exerciseId]: isFavorited,
      }));
    }
  };
        

  const handleExerciseClick = (exercise) => {
    setCurrentExercise(exercise);
    if (exercise.type === "근력") {
      setSetData([{ set: 1, weight: "", reps: "" }]);
    } else {
      setCardioData({ distance: "", duration: "", pace: "" });
    }
    setCurrentPage("exerciseRecord");
  };

  const handleAddSet = () => {
    setSetData((prev) => [...prev, { set: prev.length + 1, weight: "", reps: "" }]);
  };

  const handleSetChange = (index, field, value) => {
    const updated = [...setData];
    updated[index][field] = value;
    setSetData(updated);
  };

  const handleDeleteSet = (index) => {
    setSetData((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleSave = async () => {
    const newRecord = {
      name: currentExercise.name,
      part: currentExercise.target,
      type: currentExercise.type,
      date: new Date().toISOString().slice(0, 10),
      records: currentExercise.type === "근력" ? [...setData] : { ...cardioData },
    };
    const token = await AsyncStorage.getItem("token");

    const payload =
    currentExercise.type === "근력"
      ? {
          exerciseId: currentExercise.ExerciseId,
          strengthSets: setData.map((set) => ({
            sets: set.set,
            reps: Number(set.reps),
            weight: Number(set.weight),
          })),
        }
      : {
          exerciseId: currentExercise.ExerciseId,
          distance: parseFloat(cardioData.distance),
          time: parseInt(cardioData.duration),
          pace: parseFloat(cardioData.pace),
        };
  

    try {
      const res = await axios.post(
        "http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/exercise/log",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ 운동 기록 저장 성공:", res.data);
    } catch (err) {
      console.error("❌ 운동 기록 저장 실패:", err);
    }

    addExercise(newRecord);
    setRefreshKey((prev) => prev + 1);
    setCurrentPage("exerciseList");
    setCurrentExercise(null);
    setSetData([]);
    setCardioData({ distance: "", duration: "", pace: "" });
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const res = await axios.get("http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/exercise/favoriteSearch", { headers: { Authorization: `Bearer ${token}` } });
        const favoriteMap = {};
        res.data.forEach((item) => { favoriteMap[item.exerciseId] = true; });
        setFavorites(favoriteMap);
      } catch (err) {
        console.error("즐겨찾기 조회 실패", err);
      }
    };
    fetchFavorites();
  }, [exerciseList]);
  
  
  const favoriteExercises = exerciseList.filter((ex) => favorites[ex.ExerciseId]);
  const regularExercises = exerciseList.filter((ex) => !favorites[ex.ExerciseId]);
  const filteredFavorites = favoriteExercises.filter((ex) => ex.name.includes(exerciseName));
  const filteredRegular = regularExercises.filter((ex) => ex.name.includes(exerciseName));

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ backgroundColor: "#2D2D35" }}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* 상단 헤더 영역 */}
          <View style={styles.header}>
            {currentPage === "exerciseRecord" && (
              <TouchableOpacity
                onPress={() => setCurrentPage("exerciseList")}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#DDFB21" />
                <Text style={styles.backText}>뒤로 가기</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => sheetRef.current?.close()}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#DDFB21" />
            </TouchableOpacity>
          </View>

          {currentPage === "exerciseList" ? (
            // 운동 리스트 화면: 검색창은 상단에 고정
            <View style={{ flex: 1 }}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="black" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="운동 이름을 입력해주세요"
                  value={exerciseName}
                  onChangeText={handleSearchChange}
                />
              </View>
              <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                {filteredFavorites.length > 0 && (
                  <View>
                    {filteredFavorites.map((ex, idx) => (
                      <View key={idx} style={styles.exerciseItem}>
                        <TouchableOpacity
                          onPress={() => toggleFavorite(ex)}
                          style={styles.favoriteButton}
                        >
                          <Ionicons
                            name={favorites[ex.ExerciseId] ? "star" : "star-outline"}
                            size={24}
                            color={favorites[ex.ExerciseId] ? "#E1FF01" : "gray"}
                          />
                        </TouchableOpacity>
                        <View style={styles.exerciseTextContainer}>
                          <TouchableOpacity onPress={() => handleExerciseClick(ex)}>
                            <Text style={styles.exerciseText}>{ex.name}</Text>
                            <Text style={styles.targetText}>{ex.target}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
                {filteredRegular.length > 0 && (
                  <View>
                    {filteredRegular.map((ex, idx) => (
                      <View key={idx} style={styles.exerciseItem}>
                        <TouchableOpacity
                          onPress={() => toggleFavorite(ex)}
                          style={styles.favoriteButton}
                        >
                          <Ionicons name="star-outline" size={24} color="gray" />
                        </TouchableOpacity>
                        <View style={styles.exerciseTextContainer}>
                          <TouchableOpacity onPress={() => handleExerciseClick(ex)}>
                            <Text style={styles.exerciseText}>{ex.name}</Text>
                            <Text style={styles.targetText}>{ex.target}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          ) : (
            // 운동 기록 화면 (exerciseRecord)
            <View style={{ flex: 1, position: "relative" }}>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 120 }}
              >
                {currentExercise?.type === "근력" ? (
                  <>
                    <Text style={styles.setTitle}>{currentExercise.name}</Text>
                    <Text style={styles.recordText}>기록</Text>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderText}>세트</Text>
                      <Text style={styles.tableHeaderText}>무게</Text>
                      <Text style={styles.tableHeaderText}>횟수</Text>
                      <Text style={styles.tableHeaderText}>삭제</Text>
                    </View>
                    {setData.map((set, i) => (
                      <View key={i} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{set.set}</Text>
                        <TextInput
                          style={styles.input}
                          keyboardType="numeric"
                          value={set.weight}
                          onChangeText={(t) => handleSetChange(i, "weight", t)}
                        />
                        <TextInput
                          style={styles.input}
                          keyboardType="numeric"
                          value={set.reps}
                          onChangeText={(t) => handleSetChange(i, "reps", t)}
                        />
                        <TouchableOpacity onPress={() => handleDeleteSet(i)}>
                          <Ionicons name="trash" size={24} color="red" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity onPress={handleAddSet} style={styles.addButton}>
                      <Entypo name="plus" size={24} color="black" />
                    </TouchableOpacity>
                  </>
                ) : (
                  // 유산소 기록 입력
                  <>
                    <Text style={styles.setTitle}>{currentExercise.name}</Text>
                    <Text style={styles.recordText}>기록</Text>
                    <View style={styles.cardioRow}>
                      <View style={styles.cardioInputGroup}>
                        <Text style={styles.cardioLabel}>거리(Km)</Text>
                        <TextInput
                          style={styles.cardioInput}
                          keyboardType="numeric"
                          value={cardioData.distance}
                          onChangeText={(t) =>
                            setCardioData({ ...cardioData, distance: t })
                          }
                        />
                      </View>
                      <View style={styles.cardioInputGroup}>
                        <Text style={styles.cardioLabel}>시간(m)</Text>
                        <TextInput
                          style={styles.cardioInput}
                          keyboardType="numeric"
                          value={cardioData.duration}
                          onChangeText={(t) =>
                            setCardioData({ ...cardioData, duration: t })
                          }
                        />
                      </View>
                      <View style={styles.cardioInputGroup}>
                        <Text style={styles.cardioLabel}>평균 페이스</Text>
                        <TextInput
                          style={styles.cardioInput}
                          keyboardType="default"
                          value={cardioData.pace}
                          onChangeText={(t) =>
                            setCardioData({ ...cardioData, pace: t })
                          }
                        />
                      </View>
                    </View>
                  </>
                )}
              </ScrollView>
              {/* 등록 버튼 - 바텀시트 하단에 항상 고정 */}
              <View style={styles.footerFixed}>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                  <Text style={styles.saveText}>등록</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },
  closeButton: { position: "absolute", top: -20, right: 10 },
  backButton: { flexDirection: "row", alignItems: "center", top: -10 },
  backText: { color: "white", fontSize: 16, marginLeft: 5 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: { flex: 1, paddingLeft: 10, height: 40, fontSize: 16 },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E1FF01",
    marginVertical: 10,
  },
  exerciseItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  favoriteButton: { marginRight: 12 },
  exerciseTextContainer: { flexDirection: "column", alignItems: "flex-start" },
  exerciseText: { fontSize: 16, color: "white" },
  targetText: { fontSize: 14, color: "#929090", marginTop: 5 },
  setTitle: { fontSize: 25, fontWeight: "bold", color: "white", marginBottom: 20 },
  recordText: { fontSize: 18, color: "white", marginBottom: 30, fontWeight: "bold" },
  tableHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  tableHeaderText: { color: "white", flex: 1, textAlign: "center", fontSize: 16 },
  tableRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  tableCell: { color: "white", flex: 1, textAlign: "center" },
  input: {
    backgroundColor: "#444",
    color: "white",
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  cardioRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardioInputGroup: { alignItems: "center" },
  cardioLabel: { color: "white", fontSize: 14, marginBottom: 8 },
  cardioInput: {
    backgroundColor: "#444",
    color: "white",
    width: 80,
    height: 40,
    textAlign: "center",
    borderRadius: 10,
    fontSize: 16,
  },
  footerFixed: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#2D2D35",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: "#E1FF01",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 20,
  },
  saveText: { color: "black", fontSize: 18, fontWeight: "bold" },
});