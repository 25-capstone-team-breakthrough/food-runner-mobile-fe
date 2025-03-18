import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import IngredientScreen from '../screens/IngredientScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import NutritionCalendarScreen from '../screens/NutritionCalendarScreen';
import NutritionMainScreen from '../screens/NutritionMainScreen';
import DietRegistrationScreen from '../screens/DietRegistrationScreen';
import VitaminRegistrationScreen from '../screens/VitaminRegistrationScreen';
import DietRecommendationScreen from '../screens/DietRecommendationScreen';
import DietRecipeScreen from '../screens/DietRecipeScreen';
import ExerciseRecommendVideo from '../screens/exercise_recommendvideo';
import ExerciseHome  from '../screens/exercise_home';
import ExerciseRegister from '../screens/exercise_register';
import ExerciseHistory from '../screens/exercise_history';

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
        <Stack.Screen name="DietRecipe" component={DietRecipeScreen} />
        <Stack.Screen name="ExerciseHome" component={ExerciseHome} options={{ headerShown: false }}/>
        <Stack.Screen name="ExerciseRecommendVideo" component={ExerciseRecommendVideo} options={{ headerShown: false }}/>
        <Stack.Screen name="ExerciseRegister" component={ExerciseRegister} options={{ headerShown: false }}/>
        <Stack.Screen name="ExerciseHistory" component={ExerciseHistory} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;