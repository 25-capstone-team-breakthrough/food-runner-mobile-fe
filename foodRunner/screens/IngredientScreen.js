import React from 'react';
import { View, Text, Button , SafeAreaView, StyleSheet } from 'react-native';

export default function IngredientScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>DIngredient Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,  // 화면 전체를 차지하도록 설정
      justifyContent: 'center',  // 내용 중앙 정렬
      alignItems: 'center',  // 내용 중앙 정렬
    },
  });
