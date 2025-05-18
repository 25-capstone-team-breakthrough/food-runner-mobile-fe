import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FoodItem = ({ recipe }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("DietRecipe", { recipe })}
    >
      <Image
        source={
          typeof recipe.recipeImage === "string"
            ? { uri: recipe.recipeImage }
            : recipe.recipeImage
        }
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{recipe.recipeName}</Text>
        <Text style={styles.calories}>{recipe.recipeCalories}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    width: 330,
    height: 75,
    //padding: 15,
    borderRadius: 30,
    marginLeft: 5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },
  image: {
    width: 58,
    height: 58,
    borderRadius: 30,
    marginLeft: 20,
  },
  textContainer: {
    marginLeft: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: "450",
    marginBottom: 3,
  },
  calories: {
    fontSize: 14,
    fontWeight: "300",
    color: "#000",
  },
});

export default FoodItem;
