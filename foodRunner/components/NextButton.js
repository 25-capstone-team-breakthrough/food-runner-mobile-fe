import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// 성별, 나이, 키, 몸무게 회원정보 입력 다음 버튼 컴포넌트

const NextButton = ({ onPress, title = "다음", buttonStyle, textStyle }) => {
    return (
      <TouchableOpacity style={[styles.nextButton, buttonStyle]} onPress={onPress}>
        <Text style={[styles.nextButtonText, textStyle]}>{title} &gt;</Text>
      </TouchableOpacity>
    );
  };

const styles = StyleSheet.create({
    nextButton: {
    backgroundColor: '#E1FF01',
    width: 100,
    height: 50,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 30,
    position: 'absolute',
    bottom: 30,
    right: 30,  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    },
    nextButtonText: {
    fontSize: 18,
    paddingTop: 3,
    paddingLeft: 5,
    },
});

export default NextButton;
