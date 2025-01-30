import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";

const ReusableButton = ({ onPress, loading, text, style }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{text}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#1b1f26",
    padding: 15,
    width: "100%",
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ReusableButton;