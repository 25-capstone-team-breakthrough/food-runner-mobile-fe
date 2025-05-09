// context/ExerciseContext.js
import React, { createContext, useState } from 'react';

export const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // 💡 새로고침 트리거

  const addExercise = (exercise) => {
    setExercises((prev) => [...prev, exercise]);
    setRefreshKey((prev) => prev + 1); // 👉 트리거 증가
  };

  return (
    <ExerciseContext.Provider value={{ exercises, addExercise, refreshKey }}>
      {children}
    </ExerciseContext.Provider>
  );
};
