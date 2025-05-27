import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DietRecipeScreen from '../screens/DietRecipeScreen';
import DietRecommendationScreen from '../screens/DietRecommendationScreen';
import DietRegistrationScreen from '../screens/DietRegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import IngredientScreen from '../screens/IngredientScreen';
import InputGenderAgeScreen from '../screens/InputGenderAgeScreen';
import InputHeightWeightScreen from '../screens/InputHeightWeightScreen';
import LoginScreen from '../screens/LoginScreen';
import NutritionCalendarScreen from '../screens/NutritionCalendarScreen';
import NutritionMainScreen from '../screens/NutritionMainScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VitaminRegistrationScreen from '../screens/VitaminRegistrationScreen';
import ExerciseRecommendVideo from '../screens/exercise_recommendvideo';
import ExerciseHome  from '../screens/exercise_home';
import ExerciseRegister from '../screens/exercise_register';
import ExerciseHistory from '../screens/exercise_history';
import InBodyDetail from '../screens/InbodyDetail';
import VoiceExerciseLoggerScreen from '../screens/VoiceExerciseLoggerScreen';


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
        <Stack.Screen name="DietRecipeScreen" component={DietRecipeScreen} />
        <Stack.Screen name="ExerciseHome" component={ExerciseHome} options={{ headerShown: false }}/>
        <Stack.Screen name="ExerciseRecommendVideo" component={ExerciseRecommendVideo} options={{ headerShown: false }}/>
        <Stack.Screen name="ExerciseRegister" component={ExerciseRegister} options={{ headerShown: false }}/>
        <Stack.Screen name="ExerciseHistory" component={ExerciseHistory} options={{ headerShown: false }}/>
        <Stack.Screen name="InBodyDetail" component={InBodyDetail} options={{ headerShown: false }}/>
        <Stack.Screen name="DietRecipe" component={DietRecipeScreen}/>
        <Stack.Screen name="InputGenderAge" component={InputGenderAgeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="InputHeightWeight" component={InputHeightWeightScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="VoiceExerciseLogger" component={VoiceExerciseLoggerScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
