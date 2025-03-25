import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import IngredientScreen from '../screens/IngredientScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import NutritionCalendarScreen from '../screens/NutritionCalendarScreen';
import NutritionMainScreen from '../screens/NutritionMainScreen';
import DietRegistrationScreen from '../screens/DietRegistrationScreen';
import VitaminRegistrationScreen from '../screens/VitaminRegistrationScreen';
import DietRecommendationScreen from '../screens/DietRecommendationScreen';
import DietRecipeScreen from '../screens/DietRecipeScreen';
import InputGenderAgeScreen from '../screens/InputGenderAgeScreen'
import InputHeightWeightScreen from '../screens/InputHeightWeightScreen'


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/> 
        <Stack.Screen name="Ingredient" component={IngredientScreen} options={{ headerShown: false }}/> 
        <Stack.Screen name="NutritionCalendar" component={NutritionCalendarScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="NutritionMain" component={NutritionMainScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DietRegistration" component={DietRegistrationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="VitaminRegistion" component={VitaminRegistrationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DietRecommendation" component={DietRecommendationScreen} options={{ headerShown: false }}/>
        <Stack.Screen
          name="DietRecipe"
          component={DietRecipeScreen}
          options={{
            headerTransparent: true, // 상단 바 투명 설정
            headerTitle: '', // 제목 없애기
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            //     <Ionicons name="arrow-back" size={30} color="white" />
            //   </TouchableOpacity>
            // ),
            headerTintColor: 'white', // 텍스트 색상 흰색으로 설정
          }}
        />
        <Stack.Screen name="InputGenderAge" component={InputGenderAgeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="InputHeightWeight" component={InputHeightWeightScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;