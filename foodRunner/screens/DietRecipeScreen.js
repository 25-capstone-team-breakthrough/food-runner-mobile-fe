import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import BottomNavigation from "../components/BottomNavigation";

import { useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";

const DietRecipeScreen = () => {
    
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
  
    // const recipe = route.params?.recipe || {
    //     name: "아보카도 닭가슴살 샐러드",
    //     description: "단백질 듬뿍! 건강한 지방까지 챙긴 다이어트 샐러드!",
    //     image: require("../assets/salad.png"),
    //     ingredients: [
    //         "닭가슴살 100g",
    //         "고구마 1개",
    //         "브로콜리 1줌",
    //         "마늘 2쪽",
    //         "간장 1작은술",
    //         "올리브오일 1큰술",
    //         "소금, 후추 약간",
    //     ],
    //     steps: [
    //         "닭가슴살을 삶거나 에어프라이어로 구운 뒤 한입 크기로 썰어둔다.",
    //         "아보카도는 깍둑썰기, 방울토마토는 반으로 자른다.",
    //         "양상추를 씻어 적당히 찢고 그릇에 담는다.",
    //         "모든 재료를 넣고 올리브오일, 레몬즙, 소금, 후추로 간을 해서 섞어준다.",
    //     ],
    //     tip: "드레싱은 올리브오일, 레몬즙, 발사믹 식초로 가볍게. 아몬드, 호두를 추가하여 더 고소하고 영양이 있게. 블랙페퍼, 파프리카 가루로 나트를 섞어주고 풍미있게.",
    //     recommendedRecipes: [
    //         { id: "1", name: "연어 샐러드", image: require("../assets/salmonSalad.png") },
    //         { id: "2", name: "연어 아보카도 샐러드", image: require("../assets/salmonAvocado.png") },
    //         { id: "3", name: "두부 스크램블", image: require("../assets/dobuScb.png") },
    //         { id: "4", name: "연어 샐러드", image: require("../assets/salmonSalad.png") },
    //         { id: "5", name: "연어 아보카도 샐러드", image: require("../assets/salmonAvocado.png") },
    //         { id: "6", name: "두부 스크램블", image: require("../assets/dobuScb.png") },
    //     ],
    // };

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //       headerTransparent: true,
    //       headerTitle: "",
    //       headerBackTitleVisible: false,
    //       headerLeft: () => (
    //         <TouchableOpacity
    //           onPress={() => navigation.goBack()}
    //           style={{
    //             position: "absolute",
    //             left: 20,
    //             top: 0,
    //             zIndex: 10,
    //           }}
    //         >
    //             <Text style={{fontSize: 24, color: "#fff"}}>←</Text>
    //         </TouchableOpacity>
    //       ),
    //     });
    //   }, [navigation]);


    return (
        <View style={styles.container}>           
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
        fontSize: 10,
        fontWeight: "490",
        marginTop: 8,
        color: "#000000",
    },
});

export default DietRecipeScreen;
