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

