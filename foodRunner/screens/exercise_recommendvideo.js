import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const ITEM_WIDTH = 120; // category button width

export default function ExerciseRecommendVideo() {
  const navigation = useNavigation();
  const route = useRoute();
  const categoryRef = useRef(null);

  const categories = ["어깨", "가슴", "팔", "하체", "복근", "등", "둔근", "종아리"];
  const [selectedCategory, setSelectedCategory] = useState("어깨");

  useEffect(() => {
    const incoming = route.params?.category;
    if (incoming && categories.includes(incoming)) {
      const index = categories.findIndex((c) => c === incoming);
      setSelectedCategory(incoming);
      setTimeout(() => {
        categoryRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5, // 중앙 정렬
        });
      }, 300);
    }
  }, [route.params]);

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

      <View style={styles.categoryWrapper}>
        <FlatList
          ref={categoryRef}
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.activeCategory,
              ]}
              onPress={() => {
                setSelectedCategory(item);
                const index = categories.findIndex((c) => c === item);
                categoryRef.current?.scrollToIndex({
                  index,
                  animated: true,
                  viewPosition: 0.5,
                });
              }}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.activeCategoryText,
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
          onScrollToIndexFailed={({ index }) => {
            setTimeout(() => {
              categoryRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
            }, 300);
          }}
        />
      </View>

      <View style={styles.exerciseList}>
        
      <FlatList
        data={exerciseList[selectedCategory]}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={() => (
          <Text style={styles.exerciseListTitle}>추천 운동</Text>
        )}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.exerciseItem} onPress={() => navigateToExerciseDetail(item)}>
            <View style={[
              styles.exerciseBox,
              index < 2 && styles.recommendedBox
            ]}>
              <Text style={styles.exerciseText}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
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
  categoryWrapper: {
    height: 50,
  },
  categoryScroll: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    width: ITEM_WIDTH - 10,
    backgroundColor: "#444",
    paddingVertical: 5,
    borderRadius: 12,
    marginHorizontal: 5,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCategory: {
    backgroundColor: "#E1FF01",
  },
  categoryText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
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
  exerciseBox: {
    backgroundColor: "#333",
    height: 120,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendedBox: {
    borderWidth: 2,
    borderColor: "#DDFB21",
  },
  exerciseText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
