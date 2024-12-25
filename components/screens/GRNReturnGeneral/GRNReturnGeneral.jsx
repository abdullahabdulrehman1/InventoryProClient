import React, { useState } from "react";
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
import axios from "axios";
import ServerUrl from "../../config/ServerUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GRNReturnGeneral = ({ navigation }) => {
  const [grnrNumber, setGrnrNumber] = useState("");
  const [grnrDate, setGrnrDate] = useState("");
  const [grnNumber, setGrnNumber] = useState("");
  const [grnDate, setGrnDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [rows, setRows] = useState([
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
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

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
    if (rows.length > 1) {
      const values = [...rows];
      values.splice(index, 1);
      setRows(values);
    } else {
      Alert.alert("Error", "At least one row is required.");
    }
  };

  const handleInputChange = (index, name, value) => {
    const values = [...rows];
    values[index][name] = value;
    setRows(values);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.post(
        `${ServerUrl}/grnReturnGeneral/create-return-grn`,
        {
          token,
          grnrNumber,
          grnrDate,
          grnNumber,
          grnDate,
          remarks,
          rows,
        }
      );
      console.log(response.data);
      if (response.status === 201) {
        setSuccessModalVisible(true);
      } else {
        setErrorMessages([response.data.message || "Something went wrong."]);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      if (error.response) {
        setErrorMessages([
          error.response.data.message || "Something went wrong.",
        ]);
      } else if (error.request) {
        setErrorMessages(["No response received from server."]);
      } else {
        setErrorMessages([error.message || "Something went wrong."]);
      }
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
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
              <Text style={styles.rowLabel}>S.No</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="S.No"
                value={row.serialNo}
                onChangeText={(text) =>
                  handleInputChange(index, "serialNo", text)
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Level 3 Item Category</Text>
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
              <Text style={styles.rowLabel}>GRN Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="GRN Quantity"
                value={row.grnQty}
                onChangeText={(text) =>
                  handleInputChange(index, "grnQty", text)
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Previous Return Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Previous Return Quantity"
                value={row.previousReturnQty}
                onChangeText={(text) =>
                  handleInputChange(index, "previousReturnQty", text)
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Balance GRN Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Balance GRN Quantity"
                value={row.balanceGrnQty}
                onChangeText={(text) =>
                  handleInputChange(index, "balanceGrnQty", text)
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Return Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Return Quantity"
                value={row.returnQty}
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("GRNReturnGeneralData")}
          >
            <Text style={styles.buttonText}>Show GRN Return General Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Success</Text>
            <Text style={styles.modalText}>
              GRN Return created successfully.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate("GRNReturnGeneralData");
              }}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Error</Text>
            {errorMessages.map((message, index) => (
              <Text key={index} style={styles.modalText}>
                {message}
              </Text>
            ))}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setErrorModalVisible(false)}
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
  },
  scrollContent: {
    paddingBottom: 100,
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
    width: "100%",
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
    width: "100%",
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
    padding: 10,
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

export default GRNReturnGeneral;
