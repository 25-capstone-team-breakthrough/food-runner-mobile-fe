import React from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Image } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* 로고 */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      {/* 로그인 타이틀 */}
      <Text style={styles.title}>LOG IN</Text>

      {/* 이메일/전화번호 입력 */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="이메일 또는 전화번호" placeholderTextColor="#ccc" />
        <TouchableOpacity style={styles.verifyButton}>
          <Text style={styles.verifyText}>인증</Text>
        </TouchableOpacity>
      </View>

      {/* 비밀번호 입력 */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="비밀번호 또는 인증번호" placeholderTextColor="#ccc"secureTextEntry/>
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Ingredient")}>
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>

      {/* 회원가입 텍스트 */}
      <Text style={styles.registerText}>
        아직 회원이 아니신가요? {" "}
        <Text style={styles.registerLink} onPress={() => navigation.navigate("SignUp")}>
          회원가입하기
        </Text>
      </Text>

      {/* 앱 이름 */}
      <Text style={styles.footerText}>Food Runner</Text>
      <Text style={styles.madeBy}>made by 체력돌파</Text>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "90%",
  },
  input: {
    flex: 1,
    height: 45,
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  verifyButton: {
    backgroundColor: "#C8FF00",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  verifyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#C8FF00",
    width: "80%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
    marginTop: 50,
  },
  loginText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  registerText: {
    color: "#fff",
    marginTop: 30,
    fontSize: 14,
  },
  registerLink: {
    color: "#C8FF00",
    fontWeight: "bold",
  },
  footerText: {
    position: "absolute",
    bottom: 60,
    color: "#C8FF00",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 40,
  },
  madeBy: {
    position: "absolute",
    bottom: 45,
    color: "#888",
    fontSize: 12,
  },
});