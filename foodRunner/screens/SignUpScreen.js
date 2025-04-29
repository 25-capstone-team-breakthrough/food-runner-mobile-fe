import React, { useState } from "react";
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AuthFooter from "../components/AuthFooter";

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 확인 여부

  // 아이디 중복 확인 (예제)
  const checkDuplicateId = () => {
    if (id.trim().length < 4) {
      Alert.alert("아이디 오류", "아이디는 최소 4자 이상 입력해야 합니다.");
      return;
    }
    // 실제 API 요청이 필요하지만, 여기서는 예제
    setIsIdChecked(true);
    Alert.alert("확인 완료", "아이디를 사용할 수 있습니다.");
  };

  // 유효성 검사 및 회원가입 처리
  const handleSignUp = () => {
    if (name.trim() === "") {
      Alert.alert("입력 오류", "이름을 입력해주세요.");
      return;
    }
    if (id.trim().length < 4) {
      Alert.alert("입력 오류", "아이디는 최소 4자 이상 입력해야 합니다.");
      return;
    }
    if (!isIdChecked) {
      Alert.alert("확인 필요", "아이디 중복 확인을 해주세요.");
      return;
    }
    if (password.length < 6 || !/\W/.test(password)) {
      Alert.alert("비밀번호 오류", "비밀번호는 최소 6자 이상이며 특수문자를 포함해야 합니다.");
      return;
    }

    Alert.alert("회원가입 완료", "회원가입이 완료되었습니다.");
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 로고 */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>SIGN UP</Text>

      <TextInput
        style={styles.input}
        placeholder="이름"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.idContainer}>
        <TextInput
          style={styles.idInput}
          placeholder="아이디"
          placeholderTextColor="#ccc"
          value={id}
          onChangeText={(text) => {
            setId(text);
            setIsIdChecked(false); // 아이디 변경 시 중복 확인 필요
          }}
        />
        <TouchableOpacity style={styles.checkButton} onPress={checkDuplicateId}>
          <Text style={styles.checkText}>중복</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        회원이신가요?{" "}
        <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
          로그인하기
        </Text>
      </Text>
      
      <AuthFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: -80,
    marginBottom: 30,
  },
  title: {
    color: "#C8FF00",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 50,
  },
  input: {
    width: "90%",
    height: 45,
    backgroundColor: "#222",
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: "#fff",
  },
  idContainer: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
  },
  idInput: {
    flex: 1,
    height: 45,
    backgroundColor: "#222",
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: "#fff",
  },
  checkButton: {
    backgroundColor: "#C8FF00",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginLeft: 10,
  },
  checkText: {
    fontWeight: "bold",
    color: "#000",
  },
  signupButton: {
    backgroundColor: "#C8FF00",
    width: "80%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
    marginTop: 40,
    marginBottom: 10,
  },
  signupText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  loginText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 14,
  },
  loginLink: {
    color: "#C8FF00",
    fontWeight: "bold",
  },
});
