import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>다음 &gt;</Text>
        </TouchableOpacity>
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
  backButton: {
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
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
    flexDirection: 'row', // ✅ 한 줄에 배치
    justifyContent: 'space-between', // ✅ 좌우 간격 균등 정렬
    alignItems: 'center',
    marginBottom: 30, // ✅ 아래 여백 추가
  },
  inputWrapper: {
    flex: 1, // ✅ 동일한 크기로 배치
    marginRight: 15, // ✅ 키와 몸무게 사이 간격 추가
  },
  weightInput: {
    marginRight: 0, // ✅ 마지막 요소에는 오른쪽 여백 제거
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

export default InputHeightWeightScreen;
