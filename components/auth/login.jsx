import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userExist } from "../redux/reducers/auth";
import ServerUrl from "../config/ServerUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomAlert = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      showAlert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      showAlert(
        "Invalid Password",
        "Password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);

    // Prepare the login data
    const loginData = {
      emailAddress: email,
      password,
    };

    try {
      const response = await axios.post(`${ServerUrl}/users/login`, loginData);

      if (response.status === 200 && response.data.success) {
        console.log(response.data);

        // Store token and user in AsyncStorage
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

        dispatch(userExist(response.data.user));
        // Navigate to the home screen or another screen
      } else {
        // Handle login failure
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        showAlert(
          "Login Failed",
          error.response.data.message || "An error occurred."
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request data:", error.request);
        showAlert("Login Failed", "No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        showAlert("Login Failed", "An error occurred while logging in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appName}>Inventory Pro</Text>
      <Text style={styles.header}>Login</Text>
      <View style={styles.fieldContainer}>
        <Ionicons
          name="mail-outline"
          size={24}
          color="#333"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="Email address"
          placeholderTextColor="#888"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.fieldContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="#333"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
        />
      </View>
      <View style={styles.submitButtonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#1b1f26" />
        ) : (
          <Button title="Login" onPress={handleSubmit} color="#1b1f26" />
        )}
      </View>
      <Text
        style={styles.signInText}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? <Text style={styles.signInLink}>Sign Up</Text>
      </Text>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
    justifyContent: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#1b1f26",
    marginBottom: 10,
    textAlign: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1b1f26",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#333",
  },
  submitButtonContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 20,
  },
  signInText: {
    marginTop: 20,
    textAlign: "center",
    color: "#888",
  },
  signInLink: {
    color: "#1b1f26",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#1b1f26",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
