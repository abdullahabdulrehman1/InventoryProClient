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
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import ServerUrl from "../config/ServerUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userExist } from "../redux/reducers/auth";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
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

const Register = ({ navigation }) => {
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setPicture] = useState(null);
  const [address, setAddress] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateContactNumber = (number) => {
    const regex = /^\d{11}$/;
    return regex.test(number);
  };

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    if (
      !email ||
      !contactNumber ||
      !name ||
      !password ||
      !confirmPassword ||
      !address ||
      !picture
    ) {
      showAlert("Error", "Please fill all the fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("emailAddress", email);
    formData.append("contactNumber", contactNumber);
    formData.append("name", name);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("address", address);
    formData.append("avatar", {
      uri: picture.uri,
      type: "image/jpeg",
      name: "profile.jpg",
    });

    try {
      const response = await axios.post(
        `${ServerUrl}/users/newUser`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        // Save the token in AsyncStorage
        await SecureStore.setItemAsync("token", response.data.token);

       

        // Check user existence
        const token = await SecureStore.getItemAsync("token");
        
        console.log("Token:", token);
        await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));

        dispatch(userExist(response.data.user));
      } else {
        showAlert(
          "Registration Failed",
          response.data.message || "An error occurred."
        );
      }
    } catch (error) {
      console.error(
        "Error registering user:",
        error.response ? error.response.data : error.message
      );
      showAlert(
        "Registration Failed",
        error.response
          ? error.response.data.message
          : "An error occurred while registering."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePicture = async () => {
    try {
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      // Launch image library picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setPicture({ uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "An error occurred while selecting an image.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appName}>Inventory Pro</Text>
      <Text style={styles.header}>Sign Up</Text>
      {picture && (
        <View style={styles.avatarContainer}>
          <Image source={picture} style={styles.avatar} />
        </View>
      )}
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
          autoCapitalize="none"
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor="#888"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.fieldContainer}>
        <Ionicons
          name="person-outline"
          size={24}
          color="#333"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldContainer}>
        <Ionicons
          name="call-outline"
          size={24}
          color="#333"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={contactNumber}
          onChangeText={setContactNumber}
          placeholder="Contact Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
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
          placeholder="Password"
          autoCapitalize="none"
          placeholderTextColor="#888"
          secureTextEntry
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
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          autoCapitalize="none"
          placeholderTextColor="#888"
          secureTextEntry
        />
      </View>
      <View style={styles.fieldContainer}>
        <Ionicons
          name="image-outline"
          size={24}
          color="#333"
          style={styles.icon}
        />
        <TouchableOpacity
          style={styles.pictureButton}
          onPress={handleChoosePicture}
        >
          <Text style={styles.pictureButtonText}>
            {picture ? "Change Picture" : "Choose Picture"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fieldContainer}>
        <Ionicons
          name="home-outline"
          size={24}
          color="#333"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          autoCapitalize="none"
          placeholder="Address"
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.submitButtonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#1b1f26" />
        ) : (
          <Button title="Register" onPress={handleSubmit} color="#1b1f26" />
        )}
      </View>
      <Text style={styles.signInText}>
        Have an account?
        <Text
          style={styles.signInLink}
          onPress={() => navigation.navigate("Login")}
        >
          Sign In
        </Text>
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

export default Register;

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
  pictureButton: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  pictureButtonText: {
    color: "#333",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
