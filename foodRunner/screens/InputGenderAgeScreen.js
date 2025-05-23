import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';

const InputGenderAgeScreen = ({ navigation }) => {
  const [gender, setGender] = useState(null);
  const [birthYear, setBirthYear] = useState('');

  const handleNext = async () => {
    // 유효성 검사
    if (!gender) {
      Alert.alert('입력 필요', '성별을 선택해주세요.');
      return;
    }
    if (!birthYear || birthYear.length < 1) {
      Alert.alert('입력 필요', '만 나이를 정확히 입력해주세요.');
      return;
    }

    // 유효성 검사 수행, 성별 생년월일 프론트에 저장
    await AsyncStorage.setItem('gender', gender === '여' ? 'female' : 'male');
    await AsyncStorage.setItem('age', birthYear);
    navigation.navigate('InputHeightWeight');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <BackButton onPress={() => navigation.goBack()} />

      {/* 제목 */}
      <Text style={styles.title}>성별과 나이를{'\n'}알려주세요</Text>
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
            {gender === '남' ? '◉' : '○'}
          </Text>
          <Text style={styles.radioText}>남</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setGender('여')}>
          <Text style={gender === '여' ? styles.selectedCircle : styles.circle}>
            {gender === '여' ? '◉' : '○'}
          </Text>
          <Text style={styles.radioText}>여</Text>
        </TouchableOpacity>
      </View>

      {/* 출생연도 입력 */}
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.containerInput}>
      <Text style={styles.label}>만 나이</Text>
      <View style={styles.inputWrapper}>
        <TextInput
            style={styles.input}
            placeholder="ex) 23"
            keyboardType="numeric"
            maxLength={2}
            value={birthYear}
            onChangeText={setBirthYear}
            onSubmitEditing={() => Keyboard.dismiss()}
        />
    </View>
    </View>
    </TouchableWithoutFeedback>

      {/* 다음 버튼 (유효성 검사 포함) */}
      <NextButton onPress={handleNext} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    lineHeight: 20,
  },
  label: {
    fontSize: 22,
    marginTop: 20,
    marginLeft: 5,
    marginBottom: 5,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginLeft: 10,
    marginBottom: 40,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 40,
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
    fontSize: 33,
    marginLeft: 15,
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 0,
    paddingHorizontal: 0,
    marginBottom: 30,
  },
  input: {
    fontSize: 30,
    paddingLeft: 20,
    marginTop: 15,
    marginBottom: 10,
  },
});

export default InputGenderAgeScreen;
