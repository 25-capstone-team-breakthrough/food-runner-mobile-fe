import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ExerciseProvider } from './context/ExerciseContext';
import AppNavigator from './navigation/AppNavigator';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCamera, faCapsules, faImage, faMagnifyingGlass } from '@fortawesome/pro-light-svg-icons';
import { faCircleUser, faDumbbell, faHeartPulse, faHouse, faUtensils } from '@fortawesome/pro-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

import FontProvider from './components/FontProvider'; // ✅ 추가: 폰트 적용 컴포넌트

library.add(
  faHeartPulse,
  faUtensils,
  faHouse,
  faDumbbell,
  faCircleUser,
  faCamera,
  faCapsules,
  faImage,
  faMagnifyingGlass,
  faCoffee
);

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
