import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";


const DietRecipeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const recipe = route.params?.recipe || {
        name: "아보카도 닭가슴살 샐러드",
        description: "단백질 듬뿍! 건강한 지방까지 챙긴 다이어트 샐러드!",
        image: require("../assets/salad.png"),
        ingredients: [
            "닭가슴살 100g",
            "고구마 1개",
            "브로콜리 1줌",
            "마늘 2쪽",
            "간장 1작은술",
            "올리브오일 1큰술",
            "소금, 후추 약간",
        ],
        steps: [
            "닭가슴살을 삶거나 에어프라이어로 구운 뒤 한입 크기로 썰어둔다.",
            "아보카도는 깍둑썰기, 방울토마토는 반으로 자른다.",
            "양상추를 씻어 적당히 찢고 그릇에 담는다.",
            "모든 재료를 넣고 올리브오일, 레몬즙, 소금, 후추로 간을 해서 섞어준다.",
        ],
        tip: "드레싱은 올리브오일, 레몬즙, 발사믹 식초로 가볍게. 아몬드, 호두를 추가하여 더 고소하고 영양이 있게. 블랙페퍼, 파프리카 가루로 나트를 섞어주고 풍미있게.",
        recommendedRecipes: [
            { id: "1", name: "연어 샐러드", image: require("../assets/salmonSalad.png") },
            { id: "2", name: "연어 아보카도 샐러드", image: require("../assets/salmonAvocado.png") },
            { id: "3", name: "두부 스크램블", image: require("../assets/dobuScb.png") },
            { id: "4", name: "연어 샐러드", image: require("../assets/salmonSalad.png") },
            { id: "5", name: "연어 아보카도 샐러드", image: require("../assets/salmonAvocado.png") },
            { id: "6", name: "두부 스크램블", image: require("../assets/dobuScb.png") },
        ],
    };

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTransparent: true,
          headerTitle: "",
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: "absolute",
                left: 20,
                top: 0,
                zIndex: 10,
              }}
            >
                <Text style={{fontSize: 24, color: "#fff"}}>←</Text>
            </TouchableOpacity>
          ),
        });
      }, [navigation]);


    return (
        <View style={styles.container}>           
            <ScrollView
                contentContainerStyle={styles.scrollViewContent} 
                showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}   
            >
                {/* 상단 이미지 */}
                <Image source={recipe.image} style={styles.recipeImage} />

                {/* 제목 및 설명 */}
                <View style={styles.recipeContent}>
                    <Text style={styles.recipeTitle}>{recipe.name}</Text>
                    <Text style={styles.recipeDescription}>{recipe.description}</Text>

                    {/* 재료 */}
                    <Text style={styles.sectionTitle}>재료</Text>
                    <Text style={styles.ingredientItem}>
                        {recipe.ingredients.join(", ")}
                    </Text>

                    <View style={styles.separator}></View>

                    {/* 만드는 법 */}
                    <Text style={styles.sectionTitle}>만드는 법</Text>
                    {recipe.steps.map((step, index) => (
                        <Text key={index} style={styles.stepItem}>{index + 1}. {step}</Text>
                    ))}

                    <View style={styles.separator}></View>

                    {/* 건강하게 먹는 팁 */}
                    <Text style={styles.sectionTitle}>더 건강하게 먹는 팁</Text>
                    <Text style={styles.tipDescription}>{recipe.tip}</Text>

                    <View style={styles.separator}></View>

                    {/* 추천 레시피 */}
                    <View style={styles.recipeSection}>
                        <Text style={styles.sectionTitle}>
                            {recipe.name}
                            <Text style={styles.andText}>와</Text>
                        </Text>
                        <Text style={styles.recommendTitle}>유사한 추천 레시피</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeSlider}>
                            {recipe.recommendedRecipes.map((rec) => (
                                <View key={rec.id} style={styles.recipeCard}>
                                    <Image source={rec.image} style={styles.recipeRecommendImage} />
                                    <Text style={styles.recipeRecommendTitle}>{rec.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
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
    scrollViewContent: {
        flexGrow: 1,
        alignItems: "center",
        paddingHorizontal: 0,
    },
    recipeImage: {
        width: "100%",
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
        marginBottom: 40,
    },
    andText: {
        fontSize: 18,
        fontWeight: "400",
    },
    recommendTitle: {
        fontSize: 18,
        fontWeight: "400", 
        marginTop: -13,
        marginBottom: 20,
    },
    recipeSlider: {
        marginTop: 10,
    },
    recipeCard: {
        width: 100,
        height: 120,
        marginRight: 3,
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    recipeRecommendImage: {
        width: 100,
        height: 100,
        resizeMode: "cover",
    },
    recipeRecommendTitle: {
        fontSize: 10,
        fontWeight: "490",
        marginTop: 8,
        color: "#000000",
    },
});

export default DietRecipeScreen;
