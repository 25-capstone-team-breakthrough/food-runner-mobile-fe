import React, { useState, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useNavigation } from '@react-navigation/native';

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
    { name: "체스트 프레스", target: "대흉근, 삼두" },
    { name: "체스트 프레스", target: "대흉근, 삼두" },
    { name: "체스트 프레스", target: "대흉근, 삼두" },
    { name: "체스트 프레스", target: "대흉근, 삼두" },
    { name: "체스트 프레스", target: "대흉근, 삼두" },
    { name: "체스트 프레스", target: "대흉근, 삼두" },
    { name: "체스트 프레스", target: "대흉근, 삼두" },
    { name: "체스트 프레스", target: "대흉근, 삼두" },
    { name: "체스트 프레스", target: "대흉근, 삼두" },  // 새로운 운동 추가
  ]); // 운동 목록

  const [setData, setSetData] = useState([]); // 운동 세트 데이터를 저장하는 상태
  const [currentExercise, setCurrentExercise] = useState(null); // 선택한 운동
  const [currentPage, setCurrentPage] = useState("exerciseList"); // 현재 페이지 (운동 목록 또는 운동 기록)

  const navigation = useNavigation(); // navigation 훅 사용

  const handleSearchChange = (text) => setExerciseName(text);

  // 즐겨찾기 토글 함수
  const toggleFavorite = (exerciseName) => {
    setFavorites((prev) => {
      const newFavorites = { ...prev };
      if (newFavorites[exerciseName]) {
        delete newFavorites[exerciseName]; // 즐겨찾기 상태를 취소
      } else {
        newFavorites[exerciseName] = true; // 즐겨찾기 추가
      }
      return newFavorites;
    });
  };

  // 즐겨찾기 운동 목록과 일반 운동 목록 구분
  const favoriteExercises = exerciseList.filter(exercise => favorites[exercise.name]);
  const regularExercises = exerciseList.filter(exercise => !favorites[exercise.name]);

  const snapPoints = useMemo(() => ["50%", "80%", "90%"], []); // 여러 값으로 설정

  const handleExerciseClick = (exercise) => {
    setCurrentExercise(exercise); // 운동 이름 클릭 시 현재 운동 상태 업데이트
    setSetData([{ set: 1, weight: '', reps: '' }]); // 첫 세트 초기화
    setCurrentPage("exerciseRecord"); // 페이지 상태를 운동 기록 페이지로 변경
  };

  const handleAddSet = () => {
    setSetData(prevData => [...prevData, { set: prevData.length + 1, weight: '', reps: '' }]);
  };

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...setData];
    updatedSets[index][field] = value;
    setSetData(updatedSets);
  };

  const handleSave = () => {
    console.log('운동 기록 저장:', currentExercise.name, setData); // 운동 기록 저장
    setSetData([]); // 세트 데이터 초기화
    setCurrentExercise(null); // 선택된 운동 초기화
    setCurrentPage("exerciseList"); // 페이지 상태를 운동 목록 페이지로 변경
  };

  const handleBackToList = () => {
    setCurrentPage("exerciseList"); // 운동 목록 페이지로 돌아가기
  };

  const handleSheetClose = () => {
    setCurrentPage("exerciseList"); // 바텀시트 닫을 때 페이지를 운동 목록으로 초기화
    onClose();
  };

  const handleSheetOpen = () => {
    setCurrentPage("exerciseList"); // 바텀시트 열 때 운동 목록 페이지로 설정
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
          {/* 운동 선택 화면에서는 뒤로 가기 버튼을 표시하지 않음 */}
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
              {/* 즐겨찾기 운동 목록 */}
              {favoriteExercises.length > 0 && (
                <View>
                  <Text style={styles.favoriteTitle}>즐겨찾기 운동</Text>
                  {favoriteExercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseItem}>
                      <TouchableOpacity onPress={() => toggleFavorite(exercise.name)} style={styles.favoriteButton}>
                        <Ionicons name="star" size={24} color="yellow" />
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

              {/* 구분선 */}
              {favoriteExercises.length > 0 && <View style={styles.separator} />}

              {/* 일반 운동 목록 */}
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
            <Text style={styles.setTitle}>{currentExercise.name} 기록</Text>
            <ScrollView style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>세트</Text>
                <Text style={styles.tableHeaderText}>무게 (kg)</Text>
                <Text style={styles.tableHeaderText}>횟수</Text>
              </View>

              {setData.map((set, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>세트 {set.set}</Text>
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
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={handleAddSet} style={styles.addButton}>
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.addText}>세트 추가</Text>
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
  scrollView: { maxHeight: 500 },  // ScrollView 영역 크기를 확대하여 더 많은 항목을 표시
  exerciseItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  favoriteButton: { marginRight: 10 },
  exerciseTextContainer: { flexDirection: "column", alignItems: "flex-start" },
  exerciseText: { fontSize: 16, color: "white" },
  targetText: { fontSize: 14, color: "#929090", marginTop: 5 },
  setContainer: { marginTop: 20 },
  setTitle: { fontSize: 20, color: "#E1FF01", fontWeight: "bold", marginBottom: 15 },
  table: { marginBottom: 20 },
  tableHeader: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#444", padding: 10 },
  tableHeaderText: { color: "white", fontWeight: "bold", fontSize: 16, flex: 1, textAlign: "center" },
  tableRow: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  tableCell: { color: "white", fontSize: 16, flex: 1, textAlign: "center" },
  input: { backgroundColor: "#444", color: "white", height: 40, borderRadius: 5, marginRight: 10, flex: 1, paddingLeft: 10 },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E1FF01", paddingVertical: 10, borderRadius: 20, justifyContent: "center", marginTop: 20 },
  addText: { color: "black", fontSize: 16, marginLeft: 5 },
  saveButton: { backgroundColor: "#E1FF01", paddingVertical: 15, borderRadius: 20, marginTop: 30, alignItems: "center" },
  saveText: { color: "black", fontSize: 18, fontWeight: "bold" },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 10 },
  favoriteTitle: { fontSize: 18, fontWeight: "bold", color: "#E1FF01", marginVertical: 10 },
});
