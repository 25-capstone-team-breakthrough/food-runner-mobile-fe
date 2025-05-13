// context/ExerciseContext.js

import React, { createContext, useState } from "react";

export const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [exerciseList, setExerciseList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // ✅ 새로고침 트리거용 상태

  const addExercise = (exercise) => {
    setExerciseList((prev) => [...prev, exercise]);
  };

  return (
    <ExerciseContext.Provider
      value={{
        exerciseList,
        addExercise,
        refreshKey,
        setRefreshKey, // ✅ 꼭 포함해야 ExerciseRegister에서 작동함
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};
