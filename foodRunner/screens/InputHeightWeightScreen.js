import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const InputHeightWeightScreen = ({ navigation }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleNext = () => {
    // ✅ 유효성 검사
    if (!height || isNaN(height) || height < 50 || height > 250) {
      Alert.alert('입력 오류', '올바른 키(50~250cm)를 입력해주세요.');
      return;
    }
    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
      Alert.alert('입력 오류', '올바른 몸무게(20~300kg)를 입력해주세요.');
      return;
    }

    // ✅ 유효성 검사를 통과하면 다음 페이지로 이동
    navigation.navigate('Ingredient');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* 제목 */}
      <Text style={styles.title}>키·몸무게{'\n'}저희만 알고 있을게요</Text>
      <Text style={styles.subtitle}>
        체형별 맞춤 서비스를 위해 필요하며{'\n'}
        다른 사람에게 공개되지 않습니다
      </Text>

      {/* 키와 몸무게 입력 */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>키</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={3}
            value={height}
            onChangeText={setHeight}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>몸무게</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={3}
            value={weight}
            onChangeText={setWeight}
          />
        </View>
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>다음 &gt;</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    textAlign: 'center',
    paddingVertical: 5,
  },
  nextButton: {
    backgroundColor: '#ff0',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InputHeightWeightScreen;
