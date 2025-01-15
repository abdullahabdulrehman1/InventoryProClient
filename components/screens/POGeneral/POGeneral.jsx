import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ServerUrl from "../../config/ServerUrl";

import * as SecureStore from "expo-secure-store";
const POGeneral = ({ navigation }) => {
  const [poNumber, setPoNumber] = useState("");
  const [date, setDate] = useState("");
  const [poDelivery, setPoDelivery] = useState("");
  const [requisitionType, setRequisitionType] = useState("");
  const [supplier, setSupplier] = useState("");
  const [store, setStore] = useState("");
  const [payment, setPayment] = useState("");
  const [purchaser, setPurchaser] = useState("");
  const [remarks, setRemarks] = useState("");
  const [rows, setRows] = useState([
    {
      id: 1,
      prNo: "",
      department: "",
      category: "",
      name: "",
      uom: "",
      quantity: "",
      rate: "",
      discountAmount: "",
      otherChargesAmount: "",
      rowRemarks: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        prNo: "",
        department: "",
        category: "",
        name: "",
        uom: "",
        quantity: "",
        rate: "",
        discountAmount: "",
        otherChargesAmount: "",
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
    const values = [...rows];
    values[index][name] = value;
    setRows(values);
  };

  const validateDate = (date) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(date);
  };

  const validateForm = () => {
    if (!poNumber) {
      Alert.alert("Validation Error", "PO Number is required.");
      return false;
    }
    if (!validateDate(date)) {
      Alert.alert("Validation Error", "Invalid date format. Use DD-MM-YYYY.");
      return false;
    }
    if (!validateDate(poDelivery)) {
      Alert.alert(
        "Validation Error",
        "Invalid PO Delivery date format. Use DD-MM-YYYY."
      );
      return false;
    }
    if (!requisitionType) {
      Alert.alert("Validation Error", "Requisition Type is required.");
      return false;
    }
    if (!supplier) {
      Alert.alert("Validation Error", "Supplier is required.");
      return false;
    }
    if (!store) {
      Alert.alert("Validation Error", "Store is required.");
      return false;
    }
    if (!payment) {
      Alert.alert("Validation Error", "Payment is required.");
      return false;
    }
    if (!purchaser) {
      Alert.alert("Validation Error", "Purchaser is required.");
      return false;
    }
    if (!remarks) {
      Alert.alert("Validation Error", "Remarks are required.");
      return false;
    }

    for (let row of rows) {
      if (!row.prNo) {
        Alert.alert("Validation Error", "PR No is required.");
        return false;
      }
      if (!row.department) {
        Alert.alert("Validation Error", "Department is required.");
        return false;
      }
      if (!row.category) {
        Alert.alert("Validation Error", "Category is required.");
        return false;
      }
      if (!row.name) {
        Alert.alert("Validation Error", "Item Name is required.");
        return false;
      }
      if (!row.uom) {
        Alert.alert("Validation Error", "UOM is required.");
        return false;
      }
      if (!row.quantity || isNaN(row.quantity)) {
        Alert.alert(
          "Validation Error",
          "Quantity is required and must be a number."
        );
        return false;
      }
      if (!row.rate || isNaN(row.rate)) {
        Alert.alert(
          "Validation Error",
          "Rate is required and must be a number."
        );
        return false;
      }
      if (!row.discountAmount || isNaN(row.discountAmount)) {
        Alert.alert(
          "Validation Error",
          "Discount Amount is required and must be a number."
        );
        return false;
      }
      if (!row.otherChargesAmount || isNaN(row.otherChargesAmount)) {
        Alert.alert(
          "Validation Error",
          "Other Charges Amount is required and must be a number."
        );
        return false;
      }
      if (row.rowRemarks && row.rowRemarks.length > 150) {
        Alert.alert(
          "Validation Error",
          "Remarks cannot exceed 150 characters."
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync("token");
      const user = await SecureStore.getItemAsync("user");
      const userId = JSON.parse(user)._id;
      const [day, month, year] = date.split("-");
      const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
      const [deliveryDay, deliveryMonth, deliveryYear] = poDelivery.split("-");
      const isoDeliveryDate = new Date(
        `${deliveryYear}-${deliveryMonth}-${deliveryDay}`
      ).toISOString();

      const formattedRows = rows.map((row) => ({
        prNo: row.prNo,
        department: row.department,
        category: row.category,
        name: row.name,
        uom: row.uom,
        quantity: Number(row.quantity),
        rate: Number(row.rate),
        discountAmount: Number(row.discountAmount),
        otherChargesAmount: Number(row.otherChargesAmount),
        rowRemarks: row.rowRemarks,
        excludingTaxAmount: row.excludingTaxAmount
          ? Number(row.excludingTaxAmount)
          : 0, // Ensure excludingTaxAmount is a number
      }));

      const data = {
        userId,
        poNumber,
        date: isoDate,
        poDelivery: isoDeliveryDate,
        requisitionType,
        supplier,
        store,
        payment,
        purchaser,
        remarks,
        rows: formattedRows,
      };

      const response = await axios.post(
        `${ServerUrl}/poGeneral/createPO`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.message);
      if (response.status === 201) {
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>PO #</Text>
          </View>
          <TextInput
            style={styles.input}
            value={poNumber}
            onChangeText={setPoNumber}
            placeholder="Enter PO #"
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
            placeholder="Enter Date (DD-MM-YYYY)"
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>PO Delivery</Text>
          </View>
          <TextInput
            style={styles.input}
            value={poDelivery}
            onChangeText={setPoDelivery}
            placeholder="Enter PO Delivery Date (DD-MM-YYYY)"
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="list-outline" size={20} color="black" />
            <Text style={styles.label}>Requisition Type</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={requisitionType}
              style={styles.picker}
              onValueChange={(itemValue) => setRequisitionType(itemValue)}
            >
              <Picker.Item label="Select Requisition Type" value="" />
              <Picker.Item label="Standard" value="Standard" />
              <Picker.Item label="Urgent" value="Urgent" />
            </Picker>
          </View>
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
            placeholder="Enter Supplier"
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="storefront-outline" size={20} color="black" />
            <Text style={styles.label}>Store</Text>
          </View>
          <TextInput
            style={styles.input}
            value={store}
            onChangeText={setStore}
            placeholder="Enter Store"
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="card-outline" size={20} color="black" />
            <Text style={styles.label}>Payment</Text>
          </View>
          <TextInput
            style={styles.input}
            value={payment}
            onChangeText={setPayment}
            placeholder="Enter Payment"
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="person-outline" size={20} color="black" />
            <Text style={styles.label}>Purchaser</Text>
          </View>
          <TextInput
            style={styles.input}
            value={purchaser}
            onChangeText={setPurchaser}
            placeholder="Enter Purchaser"
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
            placeholder="Enter Remarks"
          />
        </View>
        {rows.map((row, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.rowLabel}>Row {index + 1}</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="PR No"
              value={row.prNo}
              onChangeText={(text) => handleInputChange(index, "prNo", text)}
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Department"
              value={row.department}
              onChangeText={(text) =>
                handleInputChange(index, "department", text)
              }
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Category"
              value={row.category}
              onChangeText={(text) =>
                handleInputChange(index, "category", text)
              }
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Item Name"
              value={row.name}
              onChangeText={(text) => handleInputChange(index, "name", text)}
            />
            <TextInput
              style={styles.rowInput}
              placeholder="UOM"
              value={row.uom}
              onChangeText={(text) => handleInputChange(index, "uom", text)}
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Quantity"
              value={String(row.quantity)}
              onChangeText={(text) =>
                handleInputChange(index, "quantity", text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Rate"
              value={String(row.rate)}
              onChangeText={(text) => handleInputChange(index, "rate", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Discount Amount"
              value={String(row.discountAmount)}
              onChangeText={(text) =>
                handleInputChange(index, "discountAmount", text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Other Charges Amount"
              value={String(row.otherChargesAmount)}
              onChangeText={(text) =>
                handleInputChange(index, "otherChargesAmount", text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Remarks"
              value={row.rowRemarks}
              onChangeText={(text) =>
                handleInputChange(index, "rowRemarks", text)
              }
            />
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
            onPress={() => navigation.navigate("POGeneralData")}
          >
            <Text style={styles.buttonText}>Show PO General Data</Text>
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
              Purchase Order created successfully.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate("POGeneralData");
              }}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginTop: 5,
  },
  picker: {
    padding: 0,
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

export default POGeneral;
