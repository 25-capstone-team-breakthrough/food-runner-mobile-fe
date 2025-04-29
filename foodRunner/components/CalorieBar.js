import React from 'react';
import { StyleSheet, View } from 'react-native';

const CalorieBar = ({ consumed, goal, width = 180, marginTop = 10, marginRight = 0, marginBottom = 0 }) => {
  const percentage = (consumed / goal) * 100;

  return (
    <View style={[
      styles.barBackground, 
      { width, marginTop, marginRight, marginBottom }
    ]}>
      <View style={[styles.barFill, { width: `${percentage}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  barBackground: {
    width: 180,
    height: 20,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#DDFB21',
  },
});

export default CalorieBar;
