// ExerciseHistory.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ExerciseHistory({ 
  onClose, 
  selectedDate 
}) {
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setIsDetailVisible(true);
  };

  const handleBack = () => {
    setIsDetailVisible(false);
    setSelectedExercise(null);
  };

  const historyData = [
    {
      id: "1",
      name: "바벨 스쿼트",
      part: "하체",
      records: [
        { set: 1, weight: 15, reps: 10 },
        { set: 2, weight: 15, reps: 10 },
        { set: 3, weight: 20, reps: 10 },
        { set: 4, weight: 25, reps: 10 },
      ]
    },
    {
      id: "2",
      name: "벤치프레스",
      part: "가슴",
      records: [
        { set: 1, weight: 10, reps: 12 },
        { set: 2, weight: 15, reps: 12 },
      ]
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#2D2D35", padding: 20 }}>
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
            backgroundColor: "transparent",
            padding: 8,
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#DDFB21" />
          <Text style={{ color: "white", fontSize: 16, marginLeft: 5 }}>뒤로 가기</Text>
        </TouchableOpacity>
      )}

      {/* 날짜 + 닫기 버튼 */}
      <View style={{ position: "relative", alignItems: "center", marginBottom: 15 }}>
        <Text style={{ fontSize: 25, color: "white" }}>{selectedDate}</Text>
        <TouchableOpacity
          onPress={() => {
            setIsDetailVisible(false);
            setSelectedExercise(null);
            onClose();
          }}
          style={{
            position: "absolute",
            right: 0,
            top: -8,
            zIndex: 10,
            padding: 10,
          }}
        >
          <Ionicons name="close" size={24} color="#DDFB21" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 1, backgroundColor: "#8A8A8A", marginBottom: 12 }} />

      {isDetailVisible ? (
        <>
          <Text style={{ fontSize: 25, color: "white", fontWeight: "bold", marginTop: 15, marginBottom: 20 }}>
            {selectedExercise.name}
          </Text>

          <Text style={{ fontSize: 16, color: "white", fontWeight: "500", marginBottom: 25 }}>
            기록
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12, marginBottom: 16 }}>
            <Text style={{ color: "white", fontSize: 16 }}>세트</Text>
            <Text style={{ color: "white", fontSize: 16 }}>무게 (KG)</Text>
            <Text style={{ color: "white", fontSize: 16 }}>횟수</Text>
          </View>

          <View style={{ height: 1, backgroundColor: "#8A8A8A", marginBottom: 10 }} />

          <FlatList
            data={selectedExercise.records}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 18, marginVertical: 10 }}>
                <Text style={{ color: "white", fontSize: 20 }}>{item.set}</Text>
                <Text style={{ color: "white", fontSize: 20 }}>{item.weight}</Text>
                <Text style={{ color: "white", fontSize: 20 }}>{item.reps}</Text>
              </View>
            )}
          />
        </>
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleExerciseClick(item)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 12,
                paddingHorizontal: 4,
              }}
            >
              <Text style={{ color: "white", fontSize: 17, fontWeight: "500" }}>{item.name}</Text>
              <Text style={{ color: "white", fontSize: 15, opacity: 0.85 }}>{item.part}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
