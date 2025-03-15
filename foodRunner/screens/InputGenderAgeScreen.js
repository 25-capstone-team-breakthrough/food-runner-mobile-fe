import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const InputGenderAgeScreen = ({ navigation }) => {
  const [gender, setGender] = useState(null);
  const [birthYear, setBirthYear] = useState('');

  const handleNext = () => {
    // ✅ 유효성 검사
    if (!gender) {
      Alert.alert('입력 필요', '성별을 선택해주세요.');
      return;
    }
    if (!birthYear || birthYear.length < 4) {
      Alert.alert('입력 필요', '출생년도를 정확히 입력해주세요.');
      return;
    }

    // ✅ 유효성 검사를 통과하면 다음 페이지로 이동
    navigation.navigate('InputHeightWeight');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* 제목 */}
      <Text style={styles.title}>성별과 나이를 알려주세요</Text>
      <Text style={styles.subtitle}>
        체형별 맞춤 서비스를 위해 필요하며{'\n'}
        다른 사람에게 공개되지 않습니다
      </Text>

      {/* 성별 선택 */}
      <Text style={styles.label}>성별</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setGender('남')}>
          <Text style={gender === '남' ? styles.selectedCircle : styles.circle}>
            {gender === '남' ? '✔' : '○'}
          </Text>
          <Text style={styles.radioText}>남</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setGender('여')}>
          <Text style={gender === '여' ? styles.selectedCircle : styles.circle}>
            {gender === '여' ? '✔' : '○'}
          </Text>
          <Text style={styles.radioText}>여</Text>
        </TouchableOpacity>
      </View>

      {/* 출생연도 입력 */}
      <Text style={styles.label}>출생연도</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        placeholderTextColor="#999"
        keyboardType="numeric"
        maxLength={4}
        value={birthYear}
        onChangeText={setBirthYear}
      />

      {/* 다음 버튼 (유효성 검사 포함) */}
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  circle: {
    fontSize: 24,
    color: '#000',
  },
  selectedCircle: {
    fontSize: 24,
    color: 'black',
  },
  radioText: {
    fontSize: 16,
    marginLeft: 5,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    marginBottom: 30,
  },
  nextButton: {
    backgroundColor: '#ff0',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InputGenderAgeScreen;
