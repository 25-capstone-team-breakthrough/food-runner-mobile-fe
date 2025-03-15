import React from "react";
import { View, Text, StyleSheet } from "react-native";

// 로그인, 회원가입 공통 푸터

const AuthFooter = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.footerText}>Food Runner</Text>
      <Text style={styles.madeBy}>made by 체력돌파</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    width: "100%",
  },
  footerText: {
    color: "#C8FF00",
    fontSize: 18,
    fontWeight: "bold",
  },
  madeBy: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
});

export default AuthFooter;
