import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ value, onChangeText, placeholder = "검색어를 입력하세요" }) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#4E4D4D" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    width: "90%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 5,
    marginBottom: 10,
    height: 50,
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
});

export default SearchBar;
