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
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

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
      id: 1,
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

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
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
    const values = [...rows];
    values[index][name] = value;
    setRows(values);
  };

  const validateDate = (date) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(date);
  };

  const validateForm = () => {
    if (!grnNumber) {
      Alert.alert("Validation Error", "GRN Number is required.");
      return false;
    }
    if (!validateDate(date)) {
      Alert.alert("Validation Error", "Invalid date format. Use DD-MM-YYYY.");
      return false;
    }
    if (!validateDate(supplierChallanDate)) {
      Alert.alert(
        "Validation Error",
        "Invalid Supplier Challan date format. Use DD-MM-YYYY."
      );
      return false;
    }
    if (!supplier) {
      Alert.alert("Validation Error", "Supplier is required.");
      return false;
    }
    if (!validateDate(inwardDate)) {
      Alert.alert(
        "Validation Error",
        "Invalid Inward date format. Use DD-MM-YYYY."
      );
      return false;
    }
    if (!remarks) {
      Alert.alert("Validation Error", "Remarks are required.");
      return false;
    }

    for (let row of rows) {
      if (!row.poNo) {
        Alert.alert("Validation Error", "PO No is required.");
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
      if (!row.unit) {
        Alert.alert("Validation Error", "Unit is required.");
        return false;
      }
      if (!row.poQty || isNaN(row.poQty)) {
        Alert.alert(
          "Validation Error",
          "PO Qty is required and must be a number."
        );
        return false;
      }
      if (!row.previousQty || isNaN(row.previousQty)) {
        Alert.alert(
          "Validation Error",
          "Previous Qty is required and must be a number."
        );
        return false;
      }
      if (!row.balancePoQty || isNaN(row.balancePoQty)) {
        Alert.alert(
          "Validation Error",
          "Balance PO Qty is required and must be a number."
        );
        return false;
      }
      if (!row.receivedQty || isNaN(row.receivedQty)) {
        Alert.alert(
          "Validation Error",
          "Received Qty is required and must be a number."
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
      // Add your submit logic here
      setSuccessModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
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
            <Text style={styles.label}>GRN #</Text>
          </View>
          <TextInput
            style={styles.input}
            value={grnNumber}
            onChangeText={setGrnNumber}
            placeholder="Enter GRN #"
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
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>Supplier Challan #</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplierChallanNumber}
            onChangeText={setSupplierChallanNumber}
            placeholder="Enter Supplier Challan #"
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplierChallanDate}
            onChangeText={setSupplierChallanDate}
            placeholder="Enter Date (DD-MM-YYYY)"
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
            placeholder="Enter Supplier"
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>Inward #</Text>
          </View>
          <TextInput
            style={styles.input}
            value={inwardNumber}
            onChangeText={setInwardNumber}
            placeholder="Enter Inward #"
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={inwardDate}
            onChangeText={setInwardDate}
            placeholder="Enter Date (DD-MM-YYYY)"
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
            <Text style={styles.fieldLabel}>PO No</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="PO No"
              value={row.poNo}
              onChangeText={(text) => handleInputChange(index, "poNo", text)}
            />
            <Text style={styles.fieldLabel}>Department</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Department"
              value={row.department}
              onChangeText={(text) =>
                handleInputChange(index, "department", text)
              }
            />
            <Text style={styles.fieldLabel}>Level 3 Item Category</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Level 3 Item Category"
              value={row.category}
              onChangeText={(text) =>
                handleInputChange(index, "category", text)
              }
            />
            <Text style={styles.fieldLabel}>Item Name</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Item Name"
              value={row.name}
              onChangeText={(text) => handleInputChange(index, "name", text)}
            />
            <Text style={styles.fieldLabel}>Unit</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Unit"
              value={row.unit}
              onChangeText={(text) => handleInputChange(index, "unit", text)}
            />
            <Text style={styles.fieldLabel}>PO Qty</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="PO Qty"
              value={String(row.poQty)}
              onChangeText={(text) => handleInputChange(index, "poQty", text)}
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Previous Qty</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Previous Qty"
              value={String(row.previousQty)}
              onChangeText={(text) =>
                handleInputChange(index, "previousQty", text)
              }
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Balance PO Qty</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Balance PO Qty"
              value={String(row.balancePoQty)}
              onChangeText={(text) =>
                handleInputChange(index, "balancePoQty", text)
              }
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Received Qty</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Received Qty"
              value={String(row.receivedQty)}
              onChangeText={(text) =>
                handleInputChange(index, "receivedQty", text)
              }
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Remarks</Text>
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
              Goods Received Note created successfully.
            </Text>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  fieldLabel: {
    fontWeight: "bold",
    marginBottom: 5,
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
