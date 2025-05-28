
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
// App.js
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCamera, faCapsules, faImage, faMagnifyingGlass } from "@fortawesome/pro-light-svg-icons";
import { faCircleUser, faDumbbell, faHeartPulse, faHouse, faUtensils } from "@fortawesome/pro-solid-svg-icons";
import { ExerciseProvider } from './context/ExerciseContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faCoffee} />

library.add(faHeartPulse, faUtensils, faHouse, faDumbbell, faCircleUser, faCamera, faCapsules, faImage, faMagnifyingGlass);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ExerciseProvider>
        <AppNavigator />
      </ExerciseProvider>
    </GestureHandlerRootView>
  );
}
