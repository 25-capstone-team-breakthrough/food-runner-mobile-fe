import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
// App.js
import { ExerciseProvider } from './context/ExerciseContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ExerciseProvider>
        <AppNavigator />
      </ExerciseProvider>
    </GestureHandlerRootView>
  );
}
