import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ExerciseRecommendVideo() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedCategory, setSelectedCategory] = useState("어깨");

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params]);

  const categories = ["어깨", "가슴", "팔", "하체", "복근", "등", "둔근", "종아리"];

  const exerciseList = {
    어깨: ["운동1", "운동2", "운동3", "운동4"],
    가슴: ["운동5", "운동6", "운동7", "운동8"],
    팔: ["운동9", "운동10", "운동11", "운동12"],
    하체: ["운동13", "운동14", "운동15", "운동16"],
    복근: ["운동17", "운동18", "운동19", "운동20"],
    등: ["운동21", "운동22", "운동23", "운동24"],
    둔근: ["운동25", "운동26", "운동27", "운동28"],
    종아리: ["운동29", "운동30", "운동31", "운동32"],
  };

  const navigateToExerciseDetail = (exerciseName) => {
    navigation.navigate('ExerciseDetail', { exercise: exerciseName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>운동 영상</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={30} color="#DDFB21" />
        </TouchableOpacity>
      </View>

      {/* 카테고리 탭 */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category ? styles.activeCategory : null,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category ? styles.activeCategoryText : null,
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>


      <View style={styles.exerciseList}>
      {/* 추천 운동 2개 */}
      <Text style={styles.exerciseListTitle}>추천 운동</Text>
      <FlatList
        data={exerciseList[selectedCategory]} // 전체 다
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={2}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.exerciseItem} onPress={() => navigateToExerciseDetail(item)}>
            <View style={[
              styles.exerciseBox,
              index < 2 && styles.recommendedBox // 추천 2개는 노란 테두리
            ]}>
              <Text style={styles.exerciseText}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

    </View>

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
    marginTop: 4,
    marginBottom: 4,
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
    marginBottom: 10,
  },
  exerciseItem: {
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  exerciseText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  recommendedItem: {
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  recommendedBox: {
    backgroundColor: "#333",
    height: 120,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2, // ⭐️ 테두리 추가
    borderColor: "#DDFB21",
  },
  exerciseItem: {
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  exerciseBox: {
    backgroundColor: "#333",
    height: 120,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  
});
