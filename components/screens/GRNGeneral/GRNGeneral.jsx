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
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import ServerUrl from "../../config/ServerUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GRNGeneral = ({ navigation }) => {
  const [grnNumber, setGrnNumber] = useState("");
  const [date, setDate] = useState("");
  const [supplierChallanNumber, setSupplierChallanNumber] = useState("");
  const [supplierChallanDate, setSupplierChallanDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [inwardNumber, setInwardNumber] = useState("");
  const [inwardDate, setInwardDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [rows, setRows] = useState([
    {
      poNo: "",
      department: "",
      category: "",
      name: "",
      unit: "",
      poQty: "",
      previousQty: "",
      balancePoQty: "",
      receivedQty: "",
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
        poNo: "",
        department: "",
        category: "",
        name: "",
        unit: "",
        poQty: "",
        previousQty: "",
        balancePoQty: "",
        receivedQty: "",
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
    const user = await AsyncStorage.getItem("user");
    const userId = JSON.parse(user)._id;

    try {
      const response = await axios.post(
        `${ServerUrl}/grnGeneral/createGRN`,
        {
          token,
          userId,
          grnNumber,
          date,
          supplierChallanNumber,
          supplierChallanDate,
          supplier,
          inwardNumber,
          inwardDate,
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
        setErrorMessages([error.response.data.message || "Something went wrong."]);
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
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.label}>Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="dd-mm-yyyy"
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>Supplier Challan Number</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplierChallanNumber}
            onChangeText={setSupplierChallanNumber}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>Supplier Challan Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplierChallanDate}
            onChangeText={setSupplierChallanDate}
            placeholder="dd-mm-yyyy"
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="business-outline" size={20} color="black" />
            <Text style={styles.label}>Supplier</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplier}
            onChangeText={setSupplier}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>Inward Number</Text>
          </View>
          <TextInput
            style={styles.input}
            value={inwardNumber}
            onChangeText={setInwardNumber}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>Inward Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={inwardDate}
            onChangeText={setInwardDate}
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
              <Text style={styles.rowLabel}>PO Number</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="PO Number"
                value={row.poNo}
                onChangeText={(text) => handleInputChange(index, "poNo", text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Department</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Department"
                value={row.department}
                onChangeText={(text) => handleInputChange(index, "department", text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Category</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Category"
                value={row.category}
                onChangeText={(text) => handleInputChange(index, "category", text)}
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
              <Text style={styles.rowLabel}>PO Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="PO Quantity"
                value={row.poQty}
                onChangeText={(text) => handleInputChange(index, "poQty", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Previous Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Previous Quantity"
                value={row.previousQty}
                onChangeText={(text) => handleInputChange(index, "previousQty", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Balance PO Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Balance PO Quantity"
                value={row.balancePoQty}
                onChangeText={(text) => handleInputChange(index, "balancePoQty", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Received Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Received Quantity"
                value={row.receivedQty}
                onChangeText={(text) => handleInputChange(index, "receivedQty", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Row Remarks</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Row Remarks"
                value={row.rowRemarks}
                onChangeText={(text) => handleInputChange(index, "rowRemarks", text)}
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
            onPress={() => navigation.navigate("GRNGeneralData")}
          >
            <Text style={styles.buttonText}>Show GRN General Data</Text>
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
            <Text style={styles.modalText}>GRN created successfully.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate("GRNGeneralData");
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
              <Text key={index} style={styles.modalText}>{message}</Text>
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

export default GRNGeneral;