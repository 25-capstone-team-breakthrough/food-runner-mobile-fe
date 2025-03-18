import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native"; // View 추가
import { Ionicons } from "@expo/vector-icons";

export default function ExerciseRegister({ visible, onClose }) {
  const [exerciseName, setExerciseName] = useState(""); // 운동 이름
  const [favorites, setFavorites] = useState([]); // 즐겨찾기 목록
  const [isFavorite, setIsFavorite] = useState(false); // 즐겨찾기 여부

  const handleSearchChange = (text) => {
    setExerciseName(text); // 검색한 운동 이름 업데이트
  };

  // 즐겨찾기 추가 함수
  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((exercise) => exercise !== exerciseName)); // 즐겨찾기에서 삭제
    } else {
      setFavorites([...favorites, exerciseName]); // 즐겨찾기에 추가
    }
    setIsFavorite(!isFavorite); // 즐겨찾기 상태 변경
  };

  // 운동 목록 (추후 백엔드 연결 시 동적으로 받아오도록 수정 예정)
  const exerciseList = ["바벨 스쿼트", "덤벨 스쿼트", "런닝", "데드리프트"];

  return (
    <SafeAreaView style={[styles.container, visible ? styles.show : styles.hide]}>
      <View style={styles.overlay}></View>
      <View style={styles.popup}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="black" />
          <TextInput
            style={styles.searchInput}
            placeholder="운동 이름을 입력해주세요"
            value={exerciseName}
            onChangeText={handleSearchChange}
          />
        </View>

        <ScrollView style={styles.exerciseList}>
          {exerciseList
            .filter((exercise) => exercise.includes(exerciseName)) // 검색한 운동 이름에 맞는 운동만 필터링
            .map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                  <Ionicons
                    name={isFavorite ? "star" : "star-outline"}
                    size={24}
                    color={isFavorite ? "yellow" : "gray"}
                  />
                </TouchableOpacity>
                <Text style={styles.exerciseText}>{exercise}</Text>
              </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  show: {
    display: "flex",
  },
  hide: {
    display: "none",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1,
  },
  popup: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    zIndex: 2,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    height: 40,
    fontSize: 16,
  },
  exerciseList: {
    maxHeight: 300,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  favoriteButton: {
    marginRight: 10,
  },
  exerciseText: {
    fontSize: 16,
    color: "black",
  },
});
