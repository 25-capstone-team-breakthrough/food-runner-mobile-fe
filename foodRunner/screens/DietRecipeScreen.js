import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import BottomNavigation from "../components/BottomNavigation";

import { useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import BackButton from "../components/BackButton";

const DietRecipeScreen = ({ navigation }) => {
    
    const route = useRoute();
    const initialRecipe = route.params.recipe;

    const [recipe, setRecipe] = useState(initialRecipe);
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const scrollRef = useRef(null);

    // 추천레시피 찾기
    useEffect(() => {
        const fetchAllRecipes = async () => {
        const res = await fetch("http://13.209.199.97:8080/diet/recipe/data/load");
        const data = await res.json();
        const relatedIds = [recipe.relatedRecipe1, recipe.relatedRecipe2, recipe.relatedRecipe3].map(String);
        const filtered = data.filter((r) => relatedIds.includes(String(r.recipeId)));
        setRecommendedRecipes(filtered);
        };

        fetchAllRecipes();
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, [recipe]);
  

    return (
        <View style={styles.container}>  
        <View style={styles.backButtonWrapper}>
            <BackButton onPress={() => navigation.goBack()} color="black" /> 
        </View>         
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.scrollViewContent} 
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}   
            >
                {/* 상단 이미지 */}
                <Image source={{ uri: recipe.recipeImage }} style={styles.recipeImage} />
                {/* {console.log("레시피 이미지 URL:", recipe.recipeImage)} */}

                {/* 제목 및 설명 */}
                <View style={styles.recipeContent}>
                    <Text style={styles.recipeTitle}>{recipe.recipeName}</Text>
                    {/* <Text style={styles.recipeDescription}>{recipe.description}</Text> */}

                    {/* 재료 */}
                    <Text style={styles.sectionTitle}>재료</Text>
                    <Text style={styles.ingredients}>
                        {recipe.ingredients}
                    </Text>

                    <View style={styles.separator}></View>

                    {/* 만드는 법 */}
                    <Text style={styles.sectionTitle}>만드는 법</Text>
                    <Text style={styles.stepItem}>{recipe.recipe}</Text>
                    {/* {recipe.recipe.map((step) => (
                        
                    ))} */}

                    <View style={styles.separator}></View>

                    {/* 건강하게 먹는 팁 */}
                    {/* <Text style={styles.sectionTitle}>더 건강하게 먹는 팁</Text>
                    <Text style={styles.tipDescription}>{recipe.tip}</Text>

                    <View style={styles.separator}></View> */}

                    {/* 추천 레시피 */}
                    {console.log("유사한 레시피: ", recommendedRecipes)}

                    <View style={styles.recipeSection}>
                        <Text style={styles.sectionTitle}>
                            {recipe.recipeName}
                            <Text style={styles.andText}>와</Text>
                        </Text>
                        <Text style={styles.recommendTitle}>유사한 추천 레시피</Text>

                        <View style={styles.recipeSlider}>
                            {recommendedRecipes.map((rec) => (
                            <TouchableOpacity 
                                key={rec.recipeId} 
                                onPress={() => setRecipe(rec)} 
                                style={styles.recipeCard}
                            >
                                <Image source={{ uri: rec.recipeImage }} style={styles.recipeRecommendImage} />
                                <Text style={styles.recipeRecommendTitle}>{rec.recipeName}</Text>
                            </TouchableOpacity>
                            ))}
                        </View>
                    </View> 
                </View>
            </ScrollView>

            {/* 하단 네비게이션 */}
            <BottomNavigation />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
     backButtonWrapper: {
        position: 'absolute',
        top: 50,      
        left: 20,     
        zIndex: 100,  
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: "center",
        paddingHorizontal: 0,
    },
    recipeImage: {
        width: "100%",
        height: 370,
        flex: 1,
        resizeMode: "cover",
    },
    recipeContent: {
        padding: 27,
    },
    recipeTitle: {
        fontSize: 25,
        fontWeight: "700",
        marginTop: 5,
        marginBottom: 13,
    },
    recipeDescription: {
        fontSize: 13,
        color: "#555",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 15,
        marginBottom: 15,
    },
    ingredientItem: {
        fontSize: 14,
        color: "#333",
        marginBottom: 10,
        lineHeight: 22,
    },
    separator: {
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 15,
    },
    stepItem: {
        fontSize: 14,
        color: "#333",
        marginBottom: 10,
        lineHeight: 22,
    },
    tipSection: {
        marginTop: 40,
        marginBottom: 30,
    },
    tipDescription: {
        fontSize: 14,
        color: "#555",
        marginTop: 10,
        lineHeight: 22,
        marginBottom: 10,
    },
    recipeSection: {
        marginBottom: 50,
    },
    andText: {
        fontSize: 18,
        fontWeight: "400",
    },
    recommendTitle: {
        fontSize: 18,
        fontWeight: "400", 
        marginTop: -12,
        marginBottom: 20,
    },
    recipeSlider: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,                    
    },
    recipeCard: {
        width: 100,
        height: 120,
        marginRight: 3,
        overflow: "hidden",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    recipeRecommendImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
        resizeMode: "cover",
    },
    recipeRecommendTitle: {
        fontSize: 14,
        fontWeight: "490",
        marginTop: 8,
        color: "#000000",
    },
});

export default DietRecipeScreen;
