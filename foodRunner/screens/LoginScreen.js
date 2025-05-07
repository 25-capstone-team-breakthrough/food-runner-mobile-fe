import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AuthFooter from "../components/AuthFooter";

export default function LoginScreen({ navigation }) {

  const [id, setid] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 자동로그인
  // useEffect(() => {
  //   const checkLogin = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       const isNewUser = await AsyncStorage.getItem("isNewUser");
  //       if (isNewUser === "true") {
  //       await AsyncStorage.removeItem("isNewUser");
  //       navigation.replace("InputGenderAge");
  //     } else {
  //       navigation.replace("Home");
  //     }
  //     }
  //   };
  //   checkLogin();
  // }, []);

  const handleLogin = async () => {
    // 유효성 검사
    if (!id.trim()) {
      setErrorMessage("아이디를 입력해주세요.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }
    navigation.navigate("InputGenderAge");
    try {
      // 백 서버 연결 해야 함 !
      const response = await fetch("http://ec2-13-125-126-160.ap-northeast-2.compute.amazonaws.com:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: id,
          password: password
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("name", data.name);
        await AsyncStorage.setItem("role", data.role);
      
        const isNewUser = await AsyncStorage.getItem("isNewUser");
        console.log("로그인 성공:", data);
        if (isNewUser === "true") {
          await AsyncStorage.removeItem("isNewUser");
          navigation.navigate("InputGenderAge");
        } else {
          navigation.navigate("Home");
        }
      }
      else {
        setErrorMessage(data.message || "아이디 또는 비밀번호 오류");
      }
    } catch (error) {
      console.error("로그인 요청 오류:", error);
      setErrorMessage("서버에 연결할 수 없습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 로고 */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      {/* 로그인 타이틀 */}
      <Text style={styles.title}>LOG IN</Text>

      {/* 이메일/전화번호 입력 */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="아이디를 입력해주세요" 
          placeholderTextColor="#ccc"
          value={id}
          onChangeText={setid}
        />
        {/* <TouchableOpacity style={styles.verifyButton}>
          <Text style={styles.verifyText}>인증</Text>
        </TouchableOpacity> */}
      </View>

      {/* 비밀번호 입력 */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="비밀번호를 입력해주세요" 
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* 오류 메시지 표시 */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* 로그인 버튼 */}
    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
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
  // verifyButton: {
  //   backgroundColor: "#C8FF00",
  //   paddingVertical: 10,
  //   paddingHorizontal: 15,
  //   borderRadius: 30,
  //   marginLeft: 10,
  // },
  // verifyText: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   color: "#000",
  // },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
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
});