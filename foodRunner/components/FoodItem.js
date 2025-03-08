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
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  textContainer: {
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  calories: {
    fontSize: 14,
    color: "gray",
  },
});

export default FoodItem;
