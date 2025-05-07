import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ExerciseContext } from '../context/ExerciseContext'; // ✅ 정확한 경로 확인

export default function ExerciseHistory({ onClose, selectedDate }) {
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const { exercises } = useContext(ExerciseContext);

  console.log("🟡 전체 운동 기록들:", exercises); // 이 줄 추가

  // 날짜 포맷 통일 (selectedDate: "2025.05.01" → "2025-05-01")
  const formattedDate = selectedDate.replace(/\./g, "-");
  const filteredExercises = exercises.filter((ex) => ex.date === formattedDate);
  
  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setIsDetailVisible(true);
  };

  const handleBack = () => {
    setIsDetailVisible(false);
    setSelectedExercise(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#2D2D35", padding: 20 }}>
      {/* 뒤로가기 버튼 */}
      {isDetailVisible && (
        <TouchableOpacity
          onPress={handleBack}
          style={{
            position: "absolute",
            top: 18,
            left: 10,
            zIndex: 99,
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#DDFB21" />
          <Text style={{ color: "white", fontSize: 16, marginLeft: 5 }}>뒤로 가기</Text>
        </TouchableOpacity>
      )}

      {/* 상단 날짜 및 닫기 버튼 */}
      <View style={{ position: "relative", alignItems: "center", marginBottom: 15 }}>
        <Text style={{ fontSize: 25, color: "white" }}>{selectedDate}</Text>
        <TouchableOpacity
          onPress={() => {
            setIsDetailVisible(false);
            setSelectedExercise(null);
            onClose();
          }}
          style={{ position: "absolute", right: 0, top: -8, padding: 10 }}
        >
          <Ionicons name="close" size={24} color="#DDFB21" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 1, backgroundColor: "#8A8A8A", marginBottom: 12 }} />

      {/* 상세 기록 화면 */}
      {isDetailVisible ? (
        <>
          <Text style={{
            fontSize: 25,
            color: "white",
            fontWeight: "bold",
            marginTop: 15,
            marginBottom: 20
          }}>
            {selectedExercise.name}
          </Text>

          <Text style={{
            fontSize: 16,
            color: "white",
            fontWeight: "500",
            marginBottom: 25
          }}>
            기록
          </Text>

          {selectedExercise.type === "근력" ? (
            <>
            {/* 레이블 헤더 */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 15 }}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#CCCCCC", fontSize: 14 }}>세트</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#CCCCCC", fontSize: 14 }}>무게 (KG)</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#CCCCCC", fontSize: 14 }}>횟수</Text>
              </View>
            </View>
          
            <View style={{ height: 1, backgroundColor: "#8A8A8A", marginBottom: 10 }} />
          
            {/* 기록 값 출력 */}
            {selectedExercise.records.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginBottom: 15,
                }}
              >
                <Text style={{ color: "white", fontSize: 20 }}>{item.set}</Text>
                <Text style={{ color: "white", fontSize: 20 }}>{item.weight}</Text>
                <Text style={{ color: "white", fontSize: 20 }}>{item.reps}</Text>
              </View>
            ))}
          </>
          ) : (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 15 }}>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: "#CCCCCC", fontSize: 14 }}>거리(Km)</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: "#CCCCCC", fontSize: 14 }}>시간(m)</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: "#CCCCCC", fontSize: 14 }}>평균 페이스(/Km)</Text>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: "#888", marginBottom: 10,  }} />

              <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 30,  }}>
                <Text style={{ color: "white", fontSize: 20 }}>
                  {selectedExercise.records.distance}
                </Text>
                <Text style={{ color: "white", fontSize: 20 }}>
                  {selectedExercise.records.duration}
                </Text>
                <Text style={{ color: "white", fontSize: 20 }}>
                  {selectedExercise.records.pace}
                </Text>
              </View>
            </>
          )}
        </>
      ) : (
        // 리스트 화면
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleExerciseClick(item)}
              style={{
                flexDirection: "row", // 👉 수평 정렬
                justifyContent: "space-between", // 👉 좌우 정렬
                alignItems: "center",
                marginVertical: 12,
                paddingHorizontal: 4
              }}
            >
              <View>
                <Text style={{ color: "white", fontSize: 22, fontWeight: "500" }}>
                  {item.name}
                </Text>
              </View>
              <View>
                <Text style={{ color: "white", fontSize: 14, opacity: 0.7 }}>
                  {item.part}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
