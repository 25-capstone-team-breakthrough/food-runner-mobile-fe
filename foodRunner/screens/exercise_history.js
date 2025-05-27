import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import exerciseData from "../assets/ExerciseData.json";
import { Swipeable } from 'react-native-gesture-handler';



export default function ExerciseHistory({ onClose, selectedDate, refreshKey, setRefreshKey }) {
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState([]);


  const formattedDate = selectedDate.replace(/\./g, "-");

  const filteredExercises = exerciseLogs.filter(
    (ex) => ex.date === formattedDate
  );

  

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setIsDetailVisible(true);
  };

  const handleBack = () => {
    setIsDetailVisible(false);
    setSelectedExercise(null);
  };

  const handleDeleteLog = async (logId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete(
        `http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/exercise/removeLog/${logId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsDetailVisible(false);
      setSelectedExercise(null);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("❌ 운동 기록 삭제 실패:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(
          "http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/exercise/logSearch",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const merged = res.data.map((log) => {
          const match = exerciseData.find((ex) => ex.ExerciseId === log.exerciseId);
          return {
            id: log.logId,
            date: log.createdAt.slice(0, 10),
            name: match?.ExerciseName || "이름없음",
            part: match?.ExerciseTarget?.replace(/#/g, "") || "기타",
            type: match?.ExerciseType || "기타",
            records: log.strengthSets
              ? log.strengthSets.map((s) => ({
                  set: s.sets,
                  reps: s.reps,
                  weight: s.weight,
                }))
              : {
                  distance: log.distance !== null ? String(log.distance) : "-",
                  duration: log.time !== null ? String(log.time) : "-",
                  pace: log.pace !== null ? String(log.pace) : "-",
                },
          };
        });

        setExerciseLogs(merged);
      } catch (err) {
        console.error("🔴 운동 기록 불러오기 실패:", err.response?.data || err.message);
      }
    };

    fetchLogs();
  }, [refreshKey]);

  const renderRightActions = (item) => (
    <TouchableOpacity
      onPress={() => handleDeleteLog(item.id)}
      style={{
        backgroundColor: '#FF4C4C',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        height: '100%',
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>삭제</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <TouchableOpacity
        onPress={() => handleExerciseClick(item)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#2D2D35',
        }}
      >
        <Text style={{ color: 'white', fontSize: 20 }}>{item.name}</Text>
        <Text style={{ color: 'white', fontSize: 14, opacity: 0.7 }}>{item.part}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#2D2D35", padding: 20 }}>
      {isDetailVisible && (
        <TouchableOpacity
          onPress={handleBack}
          style={{ position: "absolute", top: 18, left: 10, zIndex: 99, flexDirection: "row", alignItems: "center", padding: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color="#DDFB21" />
          <Text style={{ color: "white", fontSize: 16, marginLeft: 5 }}>뒤로 가기</Text>
        </TouchableOpacity>
      )}

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

      {isDetailVisible ? (
        <>
          <Text style={{ fontSize: 25, color: "white", fontWeight: "bold", marginTop: 15, marginBottom: 20 }}>{selectedExercise.name}</Text>
          <Text style={{ fontSize: 16, color: "white", fontWeight: "500", marginBottom: 25 }}>기록</Text>

          {selectedExercise.type === "근력" ? (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 15 }}>
                <Text style={{ color: "#CCCCCC", fontSize: 14 }}>세트</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 14 }}>무게 (KG)</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 14 }}>횟수</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#8A8A8A", marginBottom: 10 }} />
              {selectedExercise.records.map((item, index) => (
                <View key={index} style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 15 }}>
                  <Text style={{ color: "white", fontSize: 20 }}>{item.set}</Text>
                  <Text style={{ color: "white", fontSize: 20 }}>{item.weight}</Text>
                  <Text style={{ color: "white", fontSize: 20 }}>{item.reps}</Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 15 }}>
                <Text style={{ color: "#CCCCCC", fontSize: 14 }}>거리(Km)</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 14 }}>시간(m)</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 14 }}>평균 페이스(/Km)</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#888", marginBottom: 10 }} />
              <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 30 }}>
                <Text style={{ color: "white", fontSize: 20 }}>{selectedExercise.records.distance}</Text>
                <Text style={{ color: "white", fontSize: 20 }}>{selectedExercise.records.duration}</Text>
                <Text style={{ color: "white", fontSize: 20 }}>{selectedExercise.records.pace}</Text>
              </View>
            </>
          )}
        </>
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}