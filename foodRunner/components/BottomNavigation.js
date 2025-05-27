// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { StyleSheet, TouchableOpacity, View } from "react-native";

// const BottomNavigation = () => {
//   const navigation = useNavigation();
//   const route = useRoute(); // 현재 활성화된 화면 감지

//   // 화면별 아이콘 매핑
//   const screens = [
//     { name: "NutritionMain", icon: "add-circle-outline" },
//     { name: "DietRecommendation", icon: "restaurant" },
//     { name: "Home", icon: "home-outline" },
//     { name: "ExerciseHome", icon: "barbell-outline" },
//     { name: "MyPageEdit", icon: "person-circle-outline" },
//   ];

//   const isExerciseHome = route.name === "ExerciseHome"; // ExerciseHome 화면인지 확인

//   return (
//     <View style={[styles.bottomNav, isExerciseHome && styles.activeNav]}>
//       {screens.map((screen, index) => (
//         <TouchableOpacity
//           key={index}
//           onPress={() => navigation.navigate(screen.name)}
//           style={styles.navButton}
//         >
//           <View
//             style={[
//               styles.iconContainer,
//               route.name === screen.name && styles.activeIconContainer,
//               isExerciseHome && route.name === screen.name && styles.exerciseHomeIconContainer, // ExerciseHome일 때만 테두리 검정
//             ]}
//           >
//             <Ionicons
//               name={screen.icon}
//               size={28}
//               style={[
//                 styles.icon,
//                 route.name === screen.name ? styles.activeIcon : null, // 현재 화면이면 색상 변경
//               ]}
//             />
//           </View>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   bottomNav: {
//     position: "absolute",
//     bottom: 0,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//     backgroundColor: "#fff", // 기본 배경색은 흰색
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 15,
//   },
//   activeNav: {
//     backgroundColor: "#000", // ExerciseHome 화면에서는 배경을 검정색으로 변경
//     borderColor: "#000"
//   },
//   navButton: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//   },
//   iconContainer: {
//     width: 60,
//     height: 60,
//     backgroundColor: "#fff",
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#fff", // 기본 테두리는 흰색
//   },
//   activeIconContainer: {
//     backgroundColor: "#C8FF00", // 선택된 화면은 배경 색상 강조
//   },
//   exerciseHomeIconContainer: {
//     borderColor: "#000", // ExerciseHome 화면에서는 테두리를 검정으로 변경
//   },
//   icon: {
//     color: "#000", // 기본 아이콘 색상은 검정
//   },
// });

// export default BottomNavigation;


import { faCircleUser, faDumbbell, faHeartPulse, faHouse, faUtensils } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, View } from "react-native";


const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const screens = [
    { name: "NutritionMain", icon: faHeartPulse },
    { name: "DietRecommendation", icon: faUtensils },
    { name: "Home", icon: faHouse },
    { name: "ExerciseHome", icon: faDumbbell },
    { name: "MyPageEdit", icon: faCircleUser },
  ];

  const isBlackNav = ["Home", "ExerciseHome"].includes(route.name);

  return (
    <View style={[styles.bottomNav, isBlackNav && styles.blackNav]}>
      {screens.map((screen, index) => {
        const isFocused = route.name === screen.name;
        const iconColor = isBlackNav
          ? isFocused ? "#e1ff05" : "#ffffff"
          : isFocused ? "#000000" : "#b0b0b0";

        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(screen.name)}
            style={styles.navButton}
          >
            <View
              style={[
                styles.iconContainer,
                isFocused && styles.activeIconContainer,
                isBlackNav && styles.blackIconContainer,
              ]}
            >
              <FontAwesomeIcon icon={screen.icon} size={26} color={iconColor} />
            </View>
          </TouchableOpacity>
        );
      })}
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
    paddingVertical: 0,
    borderTopWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
  },
  blackNav: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconContainer: {},
  blackIconContainer: {},
});

export default BottomNavigation;

