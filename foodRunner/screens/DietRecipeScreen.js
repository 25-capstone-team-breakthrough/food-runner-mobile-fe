import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomNavigation from "../components/BottomNavigation";

const DietRecipeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    // 기본적으로 route.params.recipe가 있어야 하지만, 없을 경우를 대비해 기본값 설정
    const recipe = route.params?.recipe || {
        name: "아보카도 닭가슴살 샐러드",
        description: "단백질 듬뿍! 건강한 지방까지 챙긴 다이어트 샐러드!",
        image: require("../assets/logo.png"),
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
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* 상단 이미지 */}
                <Image source={recipe.image} style={styles.recipeImage} />

                {/* 제목 및 설명 */}
                <View style={styles.recipeContent}>
                    <Text style={styles.recipeTitle}>{recipe.name}</Text>
                    <Text style={styles.recipeDescription}>{recipe.description}</Text>

                    {/* 재료 */}
                    <Text style={styles.sectionTitle}>재료</Text>
                    {recipe.ingredients.map((ingredient, index) => (
                        <Text key={index} style={styles.ingredientItem}>- {ingredient}</Text>
                    ))}

                    {/* 만드는 법 */}
                    <Text style={styles.sectionTitle}>만드는 법</Text>
                    {recipe.steps.map((step, index) => (
                        <Text key={index} style={styles.stepItem}>{index + 1}. {step}</Text>
                    ))}
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
    recipeImage: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
    },
    recipeContent: {
        padding: 20,
    },
    recipeTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
    },
    recipeDescription: {
        fontSize: 14,
        color: "#555",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 5,
    },
    ingredientItem: {
        fontSize: 14,
        color: "#333",
    },
    stepItem: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
    },
});

export default DietRecipeScreen;
