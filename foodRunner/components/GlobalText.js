import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function GlobalText({ children, style, ...props }) {
  return (
    <Text style={[styles.default, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'NotoSansKR_400Regular',
    color: '#fff',
  },
});
