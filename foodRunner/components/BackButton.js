import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// 뒤로 가기 버튼 컴포넌트

const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Text style={styles.backArrow}>←</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
});

export default BackButton;
