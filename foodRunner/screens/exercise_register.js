import React, { useState, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

export default function ExerciseRegister({ sheetRef, onClose }) {
  const [exerciseName, setExerciseName] = useState(""); // 운동 이름
  const [favorites, setFavorites] = useState({}); // 각 운동에 대한 즐겨찾기 상태를 객체로 관리
  const [exerciseList, setExerciseList] = useState([  // 운동 목록 상태
    { name: "바벨 스쿼트", target: "대퇴사두, 대퇴이두" },
    { name: "덤벨 스쿼트", target: "대퇴사두, 대퇴이두" },
    { name: "스미스 머신 스쿼트", target: "대퇴사두, 대퇴이두" },
    { name: "고블릿 스쿼트", target: "대퇴사두, 대퇴이두" },
    { name: "불가리안 스쿼트", target: "대퇴사두, 대퇴이두" },
    { name: "체스트 프레스", target: "대흉근, 삼두" },
  ]); // 운동 목록

  const [setData, setSetData] = useState([]); // 운동 세트 데이터를 저장하는 상태
  const [currentExercise, setCurrentExercise] = useState(null); // 선택한 운동
  const [currentPage, setCurrentPage] = useState("exerciseList"); // 현재 페이지 (운동 목록 또는 운동 기록)

  const navigation = useNavigation(); // navigation 훅 사용

  const handleSearchChange = (text) => setExerciseName(text);

  const toggleFavorite = (exerciseName) => {
    setFavorites((prev) => {
      const newFavorites = { ...prev };
      if (newFavorites[exerciseName]) {
        delete newFavorites[exerciseName]; 
      } else {
        newFavorites[exerciseName] = true;
      }
      return newFavorites;
    });
  };

  const favoriteExercises = exerciseList.filter(exercise => favorites[exercise.name]);
  const regularExercises = exerciseList.filter(exercise => !favorites[exercise.name]);

  const snapPoints = useMemo(() => ["50%", "80%", "90%"], []); 

  const handleExerciseClick = (exercise) => {
    setCurrentExercise(exercise); 
    setSetData([{ set: 1, weight: '', reps: '' }]);
    setCurrentPage("exerciseRecord"); 
  };

  const handleAddSet = () => {
    setSetData(prevData => [...prevData, { set: prevData.length + 1, weight: '', reps: '' }]);
  };

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...setData];
    updatedSets[index][field] = value;
    setSetData(updatedSets);
  };

  const handleDeleteSet = (index) => {
    const updatedSets = setData.filter((set, setIndex) => setIndex !== index); 
    setSetData(updatedSets);
  };

  const handleSave = () => {
    console.log('운동 기록 저장:', currentExercise.name, setData);
    setSetData([]); 
    setCurrentExercise(null); 
    setCurrentPage("exerciseList"); 
  };

  const handleBackToList = () => {
    setCurrentPage("exerciseList"); 
  };

  const handleSheetClose = () => {
    setCurrentPage("exerciseList");
    onClose();
  };

  const handleSheetOpen = () => {
    setCurrentPage("exerciseList");
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleSheetClose}
      onOpen={handleSheetOpen}
      backgroundStyle={{ backgroundColor: "#2D2D35" }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          {currentPage === "exerciseRecord" && (
            <TouchableOpacity onPress={handleBackToList} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
              <Text style={styles.backText}>뒤로 가기</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => sheetRef.current?.close()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#DDFB21" />
          </TouchableOpacity>
        </View>

        {currentPage === "exerciseList" && (
          <View>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="black" />
              <TextInput
                style={styles.searchInput}
                placeholder="운동 이름을 입력해주세요"
                value={exerciseName}
                onChangeText={handleSearchChange}
              />
            </View>

            <ScrollView style={styles.scrollView}>
              {favoriteExercises.length > 0 && (
                <View>
                  <Text style={styles.favoriteTitle}>즐겨찾기</Text>
                  {favoriteExercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseItem}>
                      <TouchableOpacity onPress={() => toggleFavorite(exercise.name)} style={styles.favoriteButton}>
                        <Ionicons name="star" size={24} color="#E1FF01" />
                      </TouchableOpacity>
                      <View style={styles.exerciseTextContainer}>
                        <TouchableOpacity onPress={() => handleExerciseClick(exercise)}>
                          <Text style={styles.exerciseText}>{exercise.name}</Text>
                          <Text style={styles.targetText}>{exercise.target}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {favoriteExercises.length > 0 && <View style={styles.separator} />}
              {regularExercises.length > 0 && (
                <View>
                  {regularExercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseItem}>
                      <TouchableOpacity onPress={() => toggleFavorite(exercise.name)} style={styles.favoriteButton}>
                        <Ionicons name="star-outline" size={24} color="gray" />
                      </TouchableOpacity>
                      <View style={styles.exerciseTextContainer}>
                        <TouchableOpacity onPress={() => handleExerciseClick(exercise)}>
                          <Text style={styles.exerciseText}>{exercise.name}</Text>
                          <Text style={styles.targetText}>{exercise.target}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {currentPage === "exerciseRecord" && (
          <View style={styles.setContainer}>
            <Text style={styles.setTitle}>{currentExercise.name}</Text>
            <Text style={styles.recordText}>기록</Text>
            <ScrollView style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>세트</Text>
                <Text style={styles.tableHeaderText}>무게 (kg)</Text>
                <Text style={styles.tableHeaderText}>횟수</Text>
                <Text style={styles.tableHeaderText}>삭제</Text>
              </View>
              <View style={styles.separator} />
              {setData.map((set, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{set.set}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="무게"
                    keyboardType="numeric"
                    value={set.weight}
                    onChangeText={(text) => handleSetChange(index, "weight", text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="횟수"
                    keyboardType="numeric"
                    value={set.reps}
                    onChangeText={(text) => handleSetChange(index, "reps", text)}
                  />
                  <TouchableOpacity onPress={() => handleDeleteSet(index)} style={styles.deleteButton}>
                    <Ionicons name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={handleAddSet} style={styles.addButton}>
              <Entypo name="plus" size={40} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveText}>등록</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15, alignItems: "center" },
  closeButton: { position: "absolute", top: -20, right: 10 },
  backButton: { flexDirection: "row", alignItems: "center", marginRight: 10 },
  backText: { color: "white", fontSize: 16, marginLeft: 5 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0f0f0", borderRadius: 25, paddingHorizontal: 10, marginBottom: 10 },
  searchInput: { flex: 1, paddingLeft: 10, height: 40, fontSize: 16 },
  scrollView: { maxHeight: 600 },
  exerciseItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  favoriteButton: { marginRight: 10 },
  exerciseTextContainer: { flexDirection: "column", alignItems: "flex-start" },
  exerciseText: { fontSize: 16, color: "white" },
  targetText: { fontSize: 14, color: "#929090", marginTop: 5 },
  setContainer: { marginTop: 20 },
  setTitle: { fontSize: 25, color: "white", fontWeight: "bold", marginBottom: 20, textAlign: "left" },
  recordText: {
    fontSize: 18,
    color: "white",  
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 30,
  },
  table: { marginBottom: 20 },
  tableHeader: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#2D2D35", padding: 0 },
  tableHeaderText: { color: "white", fontWeight: "", fontSize: 16, textAlign: "center", flex: 1 },
  tableRow: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#2D2D35" 
  },
  tableCell: { 
    color: "white", 
    fontSize: 16, 
    textAlign: "center", 
    flex: 1 
  },
  input: { 
    backgroundColor: "#444", 
    color: "white", 
    height: 40, 
    borderRadius: 5, 
    marginRight: 10, 
    flex: 1, 
    paddingLeft: 10, 
    textAlign: "center" 
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
  saveButton: { backgroundColor: "#E1FF01", paddingVertical: 15, borderRadius: 20, marginTop: 30, alignItems: "center" },
  saveText: { color: "black", fontSize: 18, fontWeight: "bold" },
  separator: { height: 1, backgroundColor: "#2D2D35", marginVertical: 10 }, 
  favoriteTitle: { fontSize: 18, fontWeight: "bold", color: "#E1FF01", marginVertical: 10 },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  }
});
