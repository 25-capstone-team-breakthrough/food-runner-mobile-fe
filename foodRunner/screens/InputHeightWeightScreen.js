import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from 'react';
import {
  Alert, Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';

const InputHeightWeightScreen = ({ navigation }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleNext = async () => {
    // 유효성 검사
    if (!height || isNaN(height) || height < 50 || height > 250) {
      Alert.alert('입력 오류', '올바른 키를 입력해주세요.');
      return;
    }
    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
      Alert.alert('입력 오류', '올바른 몸무게(20~300kg)를 입력해주세요.');
      return;
    }
    navigation.navigate('Ingredient');
    // 유효성 검사를 통과
    try {
      // 저장된 성별/나이/token 가져오기
      const gender = await AsyncStorage.getItem('gender');
      const age = await AsyncStorage.getItem('age');
      const token = await AsyncStorage.getItem('token');

      if (!gender || !age || !token) {
        Alert.alert("데이터 오류", "필수 정보가 누락되었습니다.");
        return;
      }

      // 서버로 POST 요청 보내기
      const response = await fetch("http://13.209.199.97:8080/BMI/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          age: parseInt(age),
          gender: gender,
          height: parseFloat(height),
          weight: parseFloat(weight),
        }),
      });

      const message = await response.text();

      if (response.ok) {
        console.log("bmi 성공:", message);
        Alert.alert("BMI 업데이트", message);
        navigation.navigate('Home');
      } else {
        const error = await response.text();
        console.error("BMI 저장 실패:", error);
        Alert.alert("저장 실패", "BMI 정보를 저장할 수 없습니다.");
      }
    } catch (err) {
      console.error("BMI 전송 에러:", err);
      Alert.alert("에러", "서버에 연결할 수 없습니다.");
    }
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
              placeholderTextColor="#888"
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