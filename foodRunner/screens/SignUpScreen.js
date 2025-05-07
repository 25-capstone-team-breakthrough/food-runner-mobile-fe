import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AuthFooter from "../components/AuthFooter";

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");


  // 유효성 검사 및 회원가입 처리
  const handleSignUp = async() => {
    if (name.trim() === "") {
      Alert.alert("입력 오류", "이름을 입력해주세요.");
      return;
    }
    if (id.trim().length < 4) {
      Alert.alert("입력 오류", "아이디는 최소 4자 이상 입력해야 합니다.");
      return;
    }
    if (password.length < 6 || !/\W/.test(password)) {
      Alert.alert("비밀번호 오류", "비밀번호는 최소 6자 이상이며 특수문자를 포함해야 합니다.");
      return;
    }

  try {
    const response = await fetch("http://ec2-13-125-126-160.ap-northeast-2.compute.amazonaws.com:8080/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: id,
        name: name,
        password: password,
      }),
    });
  
    const responseText = await response.text(); // JSON이 아닐 수도 있으니까 먼저 텍스트로 받음
    console.log("서버 응답 원문:", responseText);
  
    if (response.ok) {
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        Alert.alert("서버 응답 오류", "서버가 올바른 JSON을 반환하지 않았습니다.");
        return;
      }
  
      await AsyncStorage.setItem("isNewUser", "true");
      Alert.alert("회원가입 완료", `${data.name}님 가입을 환영합니다!`);
      navigation.navigate("Login");
    } else {
      let error;
      try {
        error = JSON.parse(responseText);
      } catch {
        error = { message: responseText };
      }
      Alert.alert("회원가입 실패", error.message || "이미 사용중인 아이디입니다.");
    }
  } catch (error) {
    Alert.alert("네트워크 오류", "서버에 연결할 수 없습니다.");
    console.error(error);
  }
};
  

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>SIGN UP</Text>

      <TextInput
        style={styles.input}
        placeholder="이름을 입력해주세요"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.idContainer}>
        <TextInput
          style={styles.idInput}
          placeholder="아이디를 입력해주세요"
          placeholderTextColor="#ccc"
          value={id}
          onChangeText={(text) => {
            setId(text);
          }}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력해주세요"
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
