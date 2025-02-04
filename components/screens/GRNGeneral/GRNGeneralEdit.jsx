import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ServerUrl from "../../config/ServerUrl";
const GRNGeneralEdit = ({ navigation, route }) => {
  const { grn } = route.params; // Assuming GRN data is passed via route params

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [rows, setRows] = useState(grn.rows || []);
  const [grnNumber, setGrnNumber] = useState(grn.grnNumber || "");
  const [date, setDate] = useState(formatDate(grn.date) || "");
  const [supplierChallanNumber, setSupplierChallanNumber] = useState(
    grn.supplierChallanNumber || ""
  );
  const [supplierChallanDate, setSupplierChallanDate] = useState(
    formatDate(grn.supplierChallanDate) || ""
  );
  const [supplier, setSupplier] = useState(grn.supplier || "");
  const [inwardNumber, setInwardNumber] = useState(grn.inwardNumber || "");
  const [inwardDate, setInwardDate] = useState(
    formatDate(grn.inwardDate) || ""
  );
  const [remarks, setRemarks] = useState(grn.remarks || "");
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    console.log("Initial rows state:", rows);
  }, []);

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
    // Validate required fields
    if (
      !grnNumber ||
      !date ||
      !supplierChallanNumber ||
      !supplierChallanDate ||
      !supplier ||
      !inwardNumber ||
      !inwardDate ||
      rows.some(row => 
        !row.poNo ||
        !row.department ||
        !row.category ||
        !row.name ||
        !row.unit ||
        !row.poQty ||
        !row.previousQty ||
        !row.balancePoQty ||
        !row.receivedQty
      )
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
  
    // Validate date format
    if (
      !validateDate(date) ||
      !validateDate(supplierChallanDate) ||
      !validateDate(inwardDate)
    ) {
      Alert.alert("Error", "Please enter dates in the format dd-mm-yyyy.");
      return;
    }
  
    setLoading(true);
    const token = await SecureStore.getItemAsync("token");
    const user = await SecureStore.getItemAsync("user");
    const userId = JSON.parse(user)._id;
    const items = rows;
    const [day, month, year] = date.split("-");
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
    const [challanDay, challanMonth, challanYear] =
      supplierChallanDate.split("-");
    const isoChallanDate = new Date(
      `${challanYear}-${challanMonth}-${challanDay}`
    ).toISOString();
    const [inwardDay, inwardMonth, inwardYear] = inwardDate.split("-");
    const isoInwardDate = new Date(
      `${inwardYear}-${inwardMonth}-${inwardDay}`
    ).toISOString();
    try {
      const response = await axios.put(`${ServerUrl}/grnGeneral/update-grn`, {
        userId,
        id: grn._id,
        grnNumber,
        date: isoDate,
        supplierChallanNumber,
        supplierChallanDate: isoChallanDate,
        supplier,
        inwardNumber,
        inwardDate: isoInwardDate,
        remarks,
        rows: items,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        routes: [{ name: "GRNGeneralData" }],
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
            onPress={() => navigation.navigate("GRNGeneralData")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit GRN</Text>
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
                onChangeText={(text) =>
                  handleInputChange(index, "department", text)
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
              <Text style={styles.rowLabel}>PO Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="PO Quantity"
                value={row.poQty.toString()}
                onChangeText={(text) => handleInputChange(index, "poQty", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Previous Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Previous Quantity"
                value={row.previousQty.toString()}
                onChangeText={(text) =>
                  handleInputChange(index, "previousQty", text)
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Balance PO Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Balance PO Quantity"
                value={row.balancePoQty.toString()}
                onChangeText={(text) =>
                  handleInputChange(index, "balancePoQty", text)
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Received Quantity</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Received Quantity"
                value={row.receivedQty.toString()}
                onChangeText={(text) =>
                  handleInputChange(index, "receivedQty", text)
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
            <Text style={styles.modalText}>GRN updated successfully.</Text>
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

export default GRNGeneralEdit;
