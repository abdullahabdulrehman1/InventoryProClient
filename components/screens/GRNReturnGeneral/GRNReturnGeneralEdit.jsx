import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ServerUrl from "../../config/ServerUrl";
import { CommonActions } from "@react-navigation/native";

const GRNReturnGeneralEdit = ({ navigation, route }) => {
  const { grnReturn } = route.params; // Assuming GRN Return data is passed via route params

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [rows, setRows] = useState(grnReturn.rows || []);
  const [grnrNumber, setGrnrNumber] = useState(grnReturn.grnrNumber || "");
  const [grnrDate, setGrnrDate] = useState(
    formatDate(grnReturn.grnrDate) || ""
  );
  const [grnNumber, setGrnNumber] = useState(grnReturn.grnNumber || "");
  const [grnDate, setGrnDate] = useState(formatDate(grnReturn.grnDate) || "");
  const [remarks, setRemarks] = useState(grnReturn.remarks || "");
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    console.log("Initial rows state:", rows);
  }, []);

  const addRow = () => {
    setRows([
      ...rows,
      {
        action: "",
        serialNo: "",
        category: "",
        name: "",
        unit: "",
        grnQty: "",
        previousReturnQty: "",
        balanceGrnQty: "",
        returnQty: "",
        rowRemarks: "",
      },
    ]);
  };

  const removeRow = (index) => {
    const values = [...rows];
    values.splice(index, 1);
    setRows(values);
  };

  const handleInputChange = (index, name, value) => {
    console.log(`Updating row ${index}, field ${name} with value ${value}`);
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [name]: value } : row
    );
    setRows(updatedRows);
  };

  const validateDate = (date) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(date);
  };

  const handleSubmit = async () => {
    if (!validateDate(grnrDate) || !validateDate(grnDate)) {
      Alert.alert("Error", "Please enter dates in the format dd-mm-yyyy.");
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");
    const userId = JSON.parse(user)._id;
    const items = rows;
    const [grnrDay, grnrMonth, grnrYear] = grnrDate.split("-");
    const isoGrnrDate = new Date(
      `${grnrYear}-${grnrMonth}-${grnrDay}`
    ).toISOString();
    const [grnDay, grnMonth, grnYear] = grnDate.split("-");
    const isoGrnDate = new Date(
      `${grnYear}-${grnMonth}-${grnDay}`
    ).toISOString();
    try {
      const response = await axios.put(
        `${ServerUrl}/grnReturnGeneral/edit-grn-return-general`,
        {
          token,
          userId,
          id: grnReturn._id,
          grnrNumber,
          grnrDate: isoGrnrDate,
          grnNumber,
          grnDate: isoGrnDate,
          remarks,
          rows: items,
        }
      );
      console.log(response.data.message);
      if (response.status === 200) {
        setSuccessModalVisible(true);
      } else {
        Alert.alert("Error", response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error response:", error.response);
      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.message || "Something went wrong."
        );
      } else if (error.request) {
        Alert.alert("Error", "No response received from server.");
      } else {
        Alert.alert("Error", error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "GRNReturnGeneralData" }],
      })
    );
  };

  return (
    <View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("GRNReturnGeneralData")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit GRN Return</Text>
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>GRNR Number</Text>
          </View>
          <TextInput
            style={styles.input}
            value={grnrNumber}
            onChangeText={setGrnrNumber}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>GRNR Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={grnrDate}
            onChangeText={setGrnrDate}
            placeholder="dd-mm-yyyy"
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>GRN Number</Text>
          </View>
          <TextInput
            style={styles.input}
            value={grnNumber}
            onChangeText={setGrnNumber}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>GRN Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={grnDate}
            onChangeText={setGrnDate}
            placeholder="dd-mm-yyyy"
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={20} color="black" />
            <Text style={styles.label}>Remarks</Text>
          </View>
          <TextInput
            style={styles.input}
            value={remarks}
            onChangeText={setRemarks}
          />
        </View>
        {rows.map((row, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.rowLabel}>Row {index + 1}</Text>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Action</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Action"
                value={row.action}
                onChangeText={(text) =>
                  handleInputChange(index, "action", text)
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Serial No</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Serial No"
                value={row.serialNo}
                onChangeText={(text) =>
                  handleInputChange(index, "serialNo", text)
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Category</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Category"
                value={row.category}
                onChangeText={(text) =>
                  handleInputChange(index, "category", text)
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Item Name</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Item Name"
                value={row.name}
                onChangeText={(text) => handleInputChange(index, "name", text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Unit</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Unit"
                value={row.unit}
                onChangeText={(text) => handleInputChange(index, "unit", text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>GRN Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="GRN Qty"
                value={row.grnQty.toString()}
                onChangeText={(text) =>
                  handleInputChange(index, "grnQty", text)
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Previous Return Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Previous Return Qty"
                value={row.previousReturnQty.toString()}
                onChangeText={(text) =>
                  handleInputChange(index, "previousReturnQty", text)
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Balance GRN Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Balance GRN Qty"
                value={row.balanceGrnQty.toString()}
                onChangeText={(text) =>
                  handleInputChange(index, "balanceGrnQty", text)
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Return Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Return Qty"
                value={row.returnQty.toString()}
                onChangeText={(text) =>
                  handleInputChange(index, "returnQty", text)
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Row Remarks</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Row Remarks"
                value={row.rowRemarks}
                onChangeText={(text) =>
                  handleInputChange(index, "rowRemarks", text)
                }
              />
            </View>
            {index > 0 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeRow(index)}
              >
                <Ionicons name="remove-circle" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <View style={styles.buttonContainer}>
          <Button title="Add Row" onPress={addRow} color="#1b1f26" />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Success</Text>
            <Text style={styles.modalText}>
              GRN Return updated successfully.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 10, // Add padding to the top
  },
  scrollContent: {
    paddingBottom: 100, // Add padding to the bottom
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
    width: "100%", // Ensure all buttons have the same width
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 20,
    marginTop: 5,
  },
  row: {
    marginBottom: 15,
    position: "relative",
  },
  rowLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  rowInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 20,
    marginBottom: 5,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  button: {
    backgroundColor: "#1b1f26",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default GRNReturnGeneralEdit;
