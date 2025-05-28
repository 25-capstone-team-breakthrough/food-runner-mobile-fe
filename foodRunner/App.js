import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppNavigator from './navigation/AppNavigator';
// App.js
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faCamera, faCapsules, faImage, faMagnifyingGlass } from "@fortawesome/pro-light-svg-icons";
import { faCircleUser, faDumbbell, faFire, faHeartPulse, faHouse, faUtensils } from "@fortawesome/pro-solid-svg-icons";
import FontProvider from './components/FontProvider'; // ✅ 추가: 폰트 적용 컴포넌트
import { ExerciseProvider } from './context/ExerciseContext';

library.add(faHeartPulse, faUtensils, faHouse, faDumbbell, faCircleUser, faCamera, faCapsules, faImage, faMagnifyingGlass, faFire, faCoffee);


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FontProvider> {/* ✅ 폰트 먼저 로딩 */}
        <ExerciseProvider>
          <AppNavigator />
        </ExerciseProvider>
      </FontProvider>
    </GestureHandlerRootView>
  );
}
