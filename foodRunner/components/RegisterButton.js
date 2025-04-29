import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const RegisterButton = ({ onPress, title="등록하기", style }) => {
  return (
    <TouchableOpacity style={[styles.registerButton, style]} onPress={onPress}>
      <Text style={styles.registerText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  registerButton: {
    backgroundColor: "#E1FF01",
    width: 330,
    height: 60,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  registerText: {
    fontSize: 25,
    color: "#000",
    alignSelf: "center",
    paddingTop: 5,
  },
});

export default RegisterButton;
