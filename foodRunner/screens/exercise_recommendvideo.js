import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from "react-native";
import * as FileSystem from 'expo-file-system'; //임시


const ITEM_WIDTH = 120; // category button width

export default function ExerciseRecommendVideo() {
  const navigation = useNavigation();
  const route = useRoute();
  const categoryRef = useRef(null);

  const categories = ["어깨", "가슴", "팔", "하체", "복근", "등", "둔근", "종아리"];
  const [selectedCategory, setSelectedCategory] = useState("어깨");
  const [videoData, setVideoData] = useState({ recommended: [], searched: {},});

  const categoryMap = {
    "어깨": "어깨",
    "가슴": "가슴",
    "팔": "팔",
    "하체": "허벅지",
    "복근": "배",
    "등": "등",
    "둔근": "엉덩이",
    "종아리": "종아리",
  };
  
  const fetchVideos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get("http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/videos/exercises", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const searchedCategory = categoryMap[selectedCategory];
      const videos = response.data.searched[searchedCategory] || [];

      const newData = {
        recommended: response.data.recommended || [],
        searched: {
          ...response.data.searched,
          [searchedCategory]: videos,
        }
      };

      setVideoData(newData);
      console.log(`🌐 서버에서 '${selectedCategory}' 영상 불러옴`);
    } catch (error) {
      console.error("❌ 영상 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('token'); // 또는 Redux에서 가져오기
  //       console.log("🔥 현재 토큰:", token);
  //       const res = await axios.get("http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/videos/exercises", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setVideoData(res.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("영상 데이터 불러오기 실패:", error);
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchVideos();
  // }, []);      이건 실제 사용 코드

  useEffect(() => {
    const incoming = route.params?.category;
    if (incoming && categories.includes(incoming)) {
      const index = categories.findIndex((c) => c === incoming);
      setSelectedCategory(incoming);
      setTimeout(() => {
        categoryRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      }, 300);
    }
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>운동 영상</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={30} color="#DDFB21" />
        </TouchableOpacity>
      </View>

      {/* 카테고리 선택 바 */}
      <View style={styles.categoryWrapper}>
        <FlatList
          ref={categoryRef}
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === item && styles.activeCategory]}
              onPress={() => {
                setSelectedCategory(item);
                const index = categories.findIndex((c) => c === item);
                categoryRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
              }}
            >
              <Text style={[styles.categoryText, selectedCategory === item && styles.activeCategoryText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
        />
      </View>

      {/* AI 추천 영상 */}
      {videoData.recommended.length > 0 && (
        <View style={styles.exerciseList}>
          <Text style={styles.exerciseListTitle}>AI 추천 영상</Text>
          <FlatList
            data={videoData.recommended} // 🔥 전체 추천 영상 다 보여주기
            keyExtractor={(item, index) => `${item.videoId}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[styles.exerciseItem, { width: 200, marginRight: 10 }]}
                onPress={() => Linking.openURL(item.url)}
              >
                <View style={[styles.exerciseBox, styles.recommendedBox]}>
                  <Image
                    source={{ uri: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` }}
                    style={styles.thumbnail}
                  />
                  <Text style={styles.exerciseText} numberOfLines={1}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {/* 일반 검색 영상 */}
      <View style={styles.searchedList}>
        <FlatList
          data={videoData.searched[categoryMap[selectedCategory]] || []}
          keyExtractor={(item, index) => `${item.videoId}-${index}`}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={() => (
            <Text style={styles.exerciseListTitle}>유튜브 검색 영상</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.exerciseItem}
              onPress={() => Linking.openURL(item.url)}
            >
              <View style={styles.exerciseBox}>
                <Image
                  source={{ uri: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` }}
                  style={styles.thumbnail}
                />
                <Text style={styles.exerciseText} numberOfLines={1}>{item.title}</Text>
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
    position: "absolute",
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
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  recommendedBox: {
    borderWidth: 2,
    borderColor: "#DDFB21",
  },
  exerciseText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
  thumbnail: {
    width: "100%",
    height: 100,
  },
  searchedList: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -300, // ✅ 기존보다 줄임 (또는 0으로 완전 붙게)
  },
  
});