import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// 뒤로 가기 버튼 컴포넌트

const BackButton = ({ onPress, color='#000' }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Text style={[styles.backArrow, {color: color}]}>←</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 20,
    zIndex: 2,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
});

export default BackButton;
