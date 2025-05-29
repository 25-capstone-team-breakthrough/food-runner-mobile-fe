import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../components/BackButton";
import NextButton from "../components/NextButton";

const MyPageEditScreen = ({ navigation }) => {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedName = await AsyncStorage.getItem("userName"); // 이름 가져오기
        setName(storedName || "");
        const res = await fetch("http://13.209.199.97:8080/BMI/info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("BMI 정보 불러오기 실패");

        const data = await res.json();
        // console.log("✅ 불러온 BMI 정보:", data);

        setAge(data.age.toString());
        setGender(data.gender === "female" ? "여" : "남");
        setHeight(data.height.toString());
        setWeight(data.weight.toString());
      } catch (err) {
        console.error("❌ BMI 정보 로드 실패:", err);
        Alert.alert("오류", "BMI 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleSave = async () => {
    if (!age || !height || !weight) {
      Alert.alert("입력 오류", "모든 항목을 입력해주세요.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const genderToSend = gender === "여" ? "female" : "male";

      const payload = {
        age: parseInt(age),            // ✔️ 나이
        gender: genderToSend,          // ✔️ 성별 ("male"/"female")
        height: parseFloat(height),    // ✔️ 키
        weight: parseFloat(weight),    // ✔️ 몸무게
      };

      console.log("보낼 데이터:", payload);

      const response = await fetch("http://13.209.199.97:8080/BMI/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // ✅ 쪼개진 항목을 JSON으로 보냄
      });

      const responseText = await response.text();
      console.log("서버 응답:", responseText);

      if (response.ok) {
        // 저장된 값 로컬에도 반영 (선택 사항)
        // await AsyncStorage.setItem("age", payload.age.toString());
        // await AsyncStorage.setItem("height", payload.height.toString());
        // await AsyncStorage.setItem("weight", payload.weight.toString());

        Alert.alert("저장 완료", "변경 사항이 저장되었습니다.");
        navigation.goBack();
      } else {
        Alert.alert("저장 실패", responseText || "서버 오류로 인해 저장에 실패했습니다.");
      }
    } catch (err) {
      console.error("❌ BMI 업데이트 오류:", err);
      Alert.alert("네트워크 오류", "서버에 연결할 수 없습니다.");
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.centerWrapper}>
            <Text style={styles.headerText}>{name}님의 마이페이지</Text>
          </View>
        </View>
        <Text style={[styles.title, { fontFamily: 'NotoSansKR_400Regular' }]}>변경된 사항을{"\n"}수정해주세요</Text>

        <Text style={styles.label}>성별</Text>
        <View style={styles.genderContainer}>
          <Text style={gender === "남" ? styles.selectedCircle : styles.circle}>
            {gender === "남" ? "◉" : "○"}
          </Text>
          <Text style={styles.radioText}>남</Text>

          <Text style={gender === "여" ? styles.selectedCircle : styles.circle}>
            {gender === "여" ? "◉" : "○"}
          </Text>
          <Text style={styles.radioText}>여</Text>
        </View>

        <Text style={styles.label}>만 나이</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          editable={true}
        />

        <View style={styles.rowContainer}>
          <View style={styles.inputBlock}>
            <Text style={styles.label}>키</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
              editable={true}
            />
          </View>
          <View style={styles.inputBlock}>
            <Text style={styles.label}>몸무게</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              editable={true}
            />
          </View>
        </View>

        <NextButton onPress={handleSave} title="저장"/>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    marginRight: 30, // ← BackButton이 차지하는 너비만큼 오른쪽 여백 보정
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 22,
    marginTop: 30,
    marginLeft: 5,
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginVertical: 15,
    marginLeft: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 40,
  },
  circle: {
    fontSize: 24,
    color: "#000",
  },
  selectedCircle: {
    fontSize: 24,
    color: "black",
  },
  radioText: {
    fontSize: 33,
    marginRight: 30,
  },
  input: {
    fontSize: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    marginTop: 10,
    paddingLeft: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  inputBlock: {
    width: "48%",
  },
});

export default MyPageEditScreen;
