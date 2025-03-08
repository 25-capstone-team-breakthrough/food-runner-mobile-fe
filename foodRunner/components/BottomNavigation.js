import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute(); // 현재 활성화된 화면 감지

  // 화면별 아이콘 매핑
  const screens = [
    { name: "NutritionMain", icon: "add-circle-outline" },
    { name: "DietRecommendation", icon: "restaurant" },
    { name: "Home", icon: "home-outline" },
    { name: "Workout", icon: "barbell-outline" },
  ];

  return (
    <View style={styles.bottomNav}>
      {screens.map((screen, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate(screen.name)}
        >
          <Ionicons
            name={screen.icon}
            size={28}
            style={[
              styles.icon,
              route.name === screen.name ? styles.activeIcon : null, // 현재 화면이면 색상 변경
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  icon: {
    color: "#000",
    padding: 8,
  },
  activeIcon: {
    color: "#C8FF00", // 현재 화면인 경우 아이콘 색상 변경
  },
});

export default BottomNavigation;
