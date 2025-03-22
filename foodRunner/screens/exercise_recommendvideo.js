import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native"; // useNavigation과 useRoute 사용

export default function ExerciseRecommendVideo() {
  const navigation = useNavigation(); // useNavigation 훅을 사용하여 네비게이션 객체를 가져옵니다.
  const route = useRoute(); // useRoute 훅을 사용하여 라우트 파라미터를 가져옵니다.
  const [selectedCategory, setSelectedCategory] = useState("어깨");

  // 쿼리 파라미터 사용
  useEffect(() => {
    if (route.params?.category) { // route의 파라미터가 있다면
      setSelectedCategory(route.params.category); // 파라미터로 받아온 category 값으로 상태 설정
    }
  }, [route.params]);

  const categories = ["어깨", "가슴", "팔", "하체", "복근", "등", "둔근", "종아리"];

  // 운동 목록 예시
  const exerciseList = {
    어깨: ["운동1", "운동2", "운동3"],
    가슴: ["운동4", "운동5", "운동6"],
    팔: ["운동7", "운동8", "운동9"],
    하체: ["운동10", "운동11", "운동12"],
    복근: ["운동13", "운동14", "운동15"],
    등: ["운동16", "운동17", "운동18"],
    둔근: ["운동19", "운동20", "운동21"],
    종아리: ["운동22", "운동23", "운동24"],
  };

  const navigateToExerciseDetail = (exerciseName) => {
    navigation.navigate('ExerciseDetail', { exercise: exerciseName });  // ExerciseDetail 화면으로 이동
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단에 운동 영상 텍스트와 닫기 버튼 추가 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>운동 영상</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={30} color="#DDFB21" />
        </TouchableOpacity>
      </View>

      {/* 카테고리 탭 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category ? styles.activeCategory : null]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category ? styles.activeCategoryText : null]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 추천 운동 목록 */}
      <ScrollView style={styles.exerciseList}>
        <Text style={styles.exerciseListTitle}>추천 운동</Text>
        <View style={styles.exerciseContainer}>
          {exerciseList[selectedCategory]?.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exerciseItem}
              onPress={() => navigateToExerciseDetail(exercise)} // 운동 클릭 시 상세 페이지로 이동
            >
              <Text style={styles.exerciseText}>{exercise}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "#E1FF01",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    backgroundColor: "#444",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
    position: 'absolute',
    right: 20,
  },
  categoryScroll: {
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 20,
  },
  categoryButton: {
    backgroundColor: "#444",
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginRight: 8,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCategory: {
    backgroundColor: "#E1FF01",
  },
  categoryText: {
    color: "white",
    fontSize: 14,
  },
  activeCategoryText: {
    color: "black",
  },
  exerciseList: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  exerciseListTitle: {
    color: "#E1FF01",
    fontSize: 16,
    fontWeight: "bold",
  },
  exerciseContainer: {
    marginTop: 10,
  },
  exerciseItem: {
    marginBottom: 10,
  },
  exerciseText: {
    color: "white",
    fontSize: 14,
  },
});

