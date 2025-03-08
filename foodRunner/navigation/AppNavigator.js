import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// 스크린들 import
import IngredientScreen from '../screens/IngredientScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import NutritionCalendarScreen from '../screens/NutritionCalendarScreen';
import NutritionMainScreen from '../screens/NutritionMainScreen';
import DietRegistrationScreen from '../screens/DietRegistrationScreen';
import VitaminRegistrationScreen from '../screens/VitaminRegistrationScreen';
import DietRecommendationScreen from '../screens/DietRecommendationScreen';
import DietRecipeScreen from '../screens/DietRecipeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
        {/* <Stack.Screen name="Ingrdient" component={IngrdientScreen} /> */}
        {/* <Stack.Screen name="NutritionCalendar" component={NutritionCalendarScreen} /> */}
        {/* <Stack.Screen name="NutritionMain" component={NutritionMainScreen} /> */}
        {/* <Stack.Screen name="DietRegistration" component={DietRegistrationScreen} /> */}
        {/* <Stack.Screen name="VitaminRegistion" component={VitaminRegistionScreen} /> */}
        {/* <Stack.Screen name="DietRecommendation" component={DietRecommendationScreen} /> */}
        {/* <Stack.Screen name="DietRecipe" component={DietRecipeScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;