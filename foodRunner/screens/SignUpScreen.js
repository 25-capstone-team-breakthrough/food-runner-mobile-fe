import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* 로고 */}
      <Text style={styles.logo}>🍏🏋️</Text>

      {/* 제목 */}
      <Text style={styles.title}>SIGN UP</Text>

      {/* 이름 입력 */}
      <TextInput
        style={styles.input}
        placeholder="이름"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />

      {/* 아이디 입력 */}
      <View style={styles.idContainer}>
        <TextInput
          style={styles.idInput}
          placeholder="아이디"
          placeholderTextColor="#ccc"
          value={id}
          onChangeText={setId}
        />
        <TouchableOpacity style={styles.checkButton}>
          <Text style={styles.checkText}>중복</Text>
        </TouchableOpacity>
      </View>

      {/* 비밀번호 입력 */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* 회원가입 버튼 */}
      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupText} onPress={() => navigation.navigate("Login")}>  {/* 회원가입이 완료되었습니다 알림 추가 */}
            회원가입
        </Text>
      </TouchableOpacity>

      {/* 로그인 링크 */}
      <Text style={styles.loginText}>
        회원이신가요?{" "}
        <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
          로그인하기
        </Text>
      </Text>

      {/* 푸터 */}
      <Text style={styles.footer}>Food Runner{"\n"}made by 체력돌파</Text>
    </View>
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
    fontSize: 50,
    marginBottom: 10,
    color: "#C8FF00",
  },
  title: {
    color: "#C8FF00",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 45,
    backgroundColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: "#fff",
  },
  idContainer: {
    flexDirection: "row",
    width: "80%",
    alignItems: "center",
  },
  idInput: {
    flex: 1,
    height: 45,
    backgroundColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#fff",
  },
  checkButton: {
    backgroundColor: "#C8FF00",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
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
    borderRadius: 10,
    marginTop: 15,
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
  footer: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    position: "absolute",
    bottom: 20,
  },
});
