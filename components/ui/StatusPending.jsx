import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { userNotExist } from "../redux/reducers/auth";
import * as SecureStore from "expo-secure-store";
const StatusPending = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  const handleLogout = async () => {
    try {
      // Delete the inventoryPro token
      await SecureStore.deleteItemAsync("token");

      console.log("Sign out successful");
      dispatch(userNotExist());
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>WELCOME TO INVENTORY PRO</Text>
      <Text style={styles.title}>Status: Pending</Text>
      <Text style={styles.title}>{user?.emailAddress}</Text>
      <Text style={styles.message}>
        Your request is being processed. Please wait...
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  heading: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#1b1f26",
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default StatusPending;
