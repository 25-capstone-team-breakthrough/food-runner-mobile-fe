import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet,
  Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NextButton from '../components/NextButton';
import BackButton from '../components/BackButton';

const InputHeightWeightScreen = ({ navigation }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleNext = () => {
    // ✅ 유효성 검사
    if (!height || isNaN(height) || height < 50 || height > 250) {
      Alert.alert('입력 오류', '올바른 키를 입력해주세요.');
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        {/* 뒤로가기 버튼 */}
        <BackButton onPress={() => navigation.goBack()} />

        {/* 제목 */}
        <Text style={styles.title}>키·몸무게{'\n'}저희만 알고 있을게요</Text>
        <Text style={styles.subtitle}>
          체형별 맞춤 서비스를 위해 필요하며{'\n'}
          다른 사람에게 공개되지 않습니다
        </Text>

        {/* 키와 몸무게 입력 (한 줄 배치) */}
        <View style={styles.inputContainer}>
          {/* 키 입력 */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>키</Text>
            <TextInput
              style={styles.input}
              placeholder="ex) 165"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={3}
              value={height}
              onChangeText={setHeight}
            />
          </View>

          {/* 몸무게 입력 */}
          <View style={[styles.inputWrapper, styles.weightInput]}>
            <Text style={styles.label}>몸무게</Text>
            <TextInput
              style={styles.input}
              placeholder="ex) 60"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={3}
              value={weight}
              onChangeText={setWeight}
            />
          </View>
        </View>

        {/* 다음 버튼 */}
        <NextButton onPress={handleNext} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 600,
    marginTop: 20,
    marginLeft: 5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    marginLeft: 5,
    marginBottom: 70,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    flex: 1, 
    marginRight: 15,
  },
  weightInput: {
    marginRight: 0,
  },
  label: {
    fontSize: 20,
    marginLeft: 5,
    marginBottom: 5,
  },
  input: {
    fontSize: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    textAlign: 'center',
    paddingVertical: 5,
    marginTop: 10,
  },
});

export default InputHeightWeightScreen;
