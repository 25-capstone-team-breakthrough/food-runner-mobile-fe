import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import DietRecipeScreen from '../screens/DietRecipeScreen';
import DietRecommendationScreen from '../screens/DietRecommendationScreen';
import DietRegistrationScreen from '../screens/DietRegistrationScreen';
import ExerciseHistory from '../screens/exercise_history';
import ExerciseHome from '../screens/exercise_home';
import ExerciseRecommendVideo from '../screens/exercise_recommendvideo';
import ExerciseRegister from '../screens/exercise_register';
import HomeScreen from '../screens/HomeScreen';
import InBodyDetail from '../screens/InbodyDetail';
import IngredientScreen from '../screens/IngredientScreen';
import InputGenderAgeScreen from '../screens/InputGenderAgeScreen';
import InputHeightWeightScreen from '../screens/InputHeightWeightScreen';
import LoginScreen from '../screens/LoginScreen';
import NutritionCalendarScreen from '../screens/NutritionCalendarScreen';
import NutritionMainScreen from '../screens/NutritionMainScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VitaminRegistrationScreen from '../screens/VitaminRegistrationScreen';
import VoiceExerciseLoggerScreen from '../screens/VoiceExerciseLoggerScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          animationEnabled: false, // ✅ 모든 화면 애니메이션 제거
          headerShown: false,      // ✅ 전역 header 제거도 가능 (선택)
          lazy: false,
          transitionSpec: {
            open: TransitionSpecs.FadeInFromBottomAndroidSpec,
            close: TransitionSpecs.FadeOutToBottomAndroidSpec,
          },
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      >
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
        <Stack.Screen name="DietRecipe" component={DietRecipeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="InputGenderAge" component={InputGenderAgeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="InputHeightWeight" component={InputHeightWeightScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="VoiceExerciseLogger" component={VoiceExerciseLoggerScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;