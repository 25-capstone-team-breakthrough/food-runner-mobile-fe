import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppNavigator from './navigation/AppNavigator';
// App.js
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faCamera, faCapsules, faImage, faMagnifyingGlass } from "@fortawesome/pro-light-svg-icons";
import { faCircleUser, faDumbbell, faFire, faHeartPulse, faHouse, faUtensils } from "@fortawesome/pro-solid-svg-icons";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontProvider from './components/FontProvider';
import { ExerciseProvider } from './context/ExerciseContext';


library.add(faHeartPulse, faUtensils, faHouse, faDumbbell, faCircleUser, faCamera, faCapsules, faImage, faMagnifyingGlass, faFire, faCoffee);


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FontProvider> 
          <ExerciseProvider>
            <AppNavigator />
          </ExerciseProvider>
        </FontProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
