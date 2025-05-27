
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
// App.js
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser, faDumbbell, faHeartPulse, faHouse, faUtensils } from "@fortawesome/pro-solid-svg-icons";
import { ExerciseProvider } from './context/ExerciseContext';

library.add(faHeartPulse, faUtensils, faHouse, faDumbbell, faCircleUser);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ExerciseProvider>
        <AppNavigator />
      </ExerciseProvider>
    </GestureHandlerRootView>
  );
}
