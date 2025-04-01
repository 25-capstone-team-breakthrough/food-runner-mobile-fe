import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const FoodItem = ({ food }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("DietRecipe", { food })}
    >
      <Image source={food.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.calories}>{food.calories}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    width: 340,
    height: 75,
    padding: 15,
    borderRadius: 30,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginLeft: 20,
  },
  textContainer: {
    marginLeft: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 3,
  },
  calories: {
    fontSize: 14,
    fontWeight: "300",
    color: "#000",
  },
});

export default FoodItem;
