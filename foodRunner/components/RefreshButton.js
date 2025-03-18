import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 재료 추가 새로고침 버튼
const RefreshButton = ({ onPress }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.timing(rotateAnim, {
      toValue: 1, 
      duration: 500, 
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    onPress();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.circle} onPress={handlePress} activeOpacity={0.7}>
        <Animated.View style={{ transform: [{ rotate: rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
          }) }]
        }}>
          <Ionicons name="refresh" size={24} color="#4E4D4D" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end", // 오른쪽 정렬
    alignItems: "center",
    paddingHorizontal: 20, // 여백 조정
    width: "100%",
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default RefreshButton;
