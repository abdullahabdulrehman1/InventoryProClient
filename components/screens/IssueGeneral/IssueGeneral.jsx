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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ServerUrl from "../../config/ServerUrl";
import * as SecureStore from 'expo-secure-store';
const IssueGeneral = ({ navigation }) => {
  const [grnNumber, setGrnNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [store, setStore] = useState("");
  const [requisitionType, setRequisitionType] = useState("");
  const [issueToUnit, setIssueToUnit] = useState("");
  const [demandNo, setDemandNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [issueToDepartment, setIssueToDepartment] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [driver, setDriver] = useState("");
  const [remarks, setRemarks] = useState("");
  const [rows, setRows] = useState([
    {
      action: "",
      serialNo: "",
      level3ItemCategory: "",
      itemName: "",
      uom: "",
      grnQty: "",
      previousIssueQty: "",
      balanceQty: "",
      issueQty: "",
      rowRemarks: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const addRow = () => {
    setRows([
      ...rows,
      {
        action: "",
        serialNo: "",
        level3ItemCategory: "",
        itemName: "",
        uom: "",
        grnQty: "",
        previousIssueQty: "",
        balanceQty: "",
        issueQty: "",
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

  const validateDate = (date) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(date);
  };

  const handleSubmit = async () => {
    if (!validateDate(issueDate)) {
      Alert.alert("Error", "Please enter dates in the format dd-mm-yyyy.");
      return;
    }

    setLoading(true);
    const token = await SecureStore.getItemAsync("token");
    const user = await SecureStore.getItemAsync("user");
    const userId = JSON.parse(user)._id;
    const items = rows;
    const [issueDay, issueMonth, issueYear] = issueDate.split("-");
    const isoIssueDate = new Date(`${issueYear}-${issueMonth}-${issueDay}`).toISOString();

    try {
      const response = await axios.post(`${ServerUrl}/issueGeneral/create-issue-general`, {
        token,
        userId,
        grnNumber,
        issueDate: isoIssueDate,
        store,
        requisitionType,
        issueToUnit,
        demandNo,
        vehicleType,
        issueToDepartment,
        vehicleNo,
        driver,
        remarks,
        rows: items,
      },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      console.log(response.data);
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
    <View>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>GRN #</Text>
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
            <Text style={styles.label}>Issue Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={issueDate}
            onChangeText={setIssueDate}
            placeholder="dd-mm-yyyy"
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="business-outline" size={20} color="black" />
            <Text style={styles.label}>Store</Text>
          </View>
          <TextInput
            style={styles.input}
            value={store}
            onChangeText={setStore}
            required
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
              <Picker.Item label="Without Requisition" value="Without Requisition" />
              <Picker.Item label="On Requisition" value="On Requisition" />
            </Picker>
          </View>
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="business-outline" size={20} color="black" />
            <Text style={styles.label}>Issue to Unit</Text>
          </View>
          <TextInput
            style={styles.input}
            value={issueToUnit}
            onChangeText={setIssueToUnit}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>Demand No</Text>
          </View>
          <TextInput
            style={styles.input}
            value={demandNo}
            onChangeText={setDemandNo}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="car-outline" size={20} color="black" />
            <Text style={styles.label}>Vehicle Type</Text>
          </View>
          <TextInput
            style={styles.input}
            value={vehicleType}
            onChangeText={setVehicleType}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="business-outline" size={20} color="black" />
            <Text style={styles.label}>Issue to Department</Text>
          </View>
          <TextInput
            style={styles.input}
            value={issueToDepartment}
            onChangeText={setIssueToDepartment}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="car-outline" size={20} color="black" />
            <Text style={styles.label}>Vehicle No</Text>
          </View>
          <TextInput
            style={styles.input}
            value={vehicleNo}
            onChangeText={setVehicleNo}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="person-outline" size={20} color="black" />
            <Text style={styles.label}>Driver</Text>
          </View>
          <TextInput
            style={styles.input}
            value={driver}
            onChangeText={setDriver}
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
                onChangeText={(text) => handleInputChange(index, "action", text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>S.No</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="S.No"
                value={row.serialNo}
                onChangeText={(text) => handleInputChange(index, "serialNo", text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Level 3 Item Category</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Level 3 Item Category"
                value={row.level3ItemCategory}
                onChangeText={(text) => handleInputChange(index, "level3ItemCategory", text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Item Name</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Item Name"
                value={row.itemName}
                onChangeText={(text) => handleInputChange(index, "itemName", text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Uom</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Uom"
                value={row.uom}
                onChangeText={(text) => handleInputChange(index, "uom", text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>GRN Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="GRN Qty"
                value={row.grnQty}
                onChangeText={(text) => handleInputChange(index, "grnQty", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Previous Issue Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Previous Issue Qty"
                value={row.previousIssueQty}
                onChangeText={(text) => handleInputChange(index, "previousIssueQty", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Balance Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Balance Qty"
                value={row.balanceQty}
                onChangeText={(text) => handleInputChange(index, "balanceQty", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Issue Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Issue Qty"
                value={row.issueQty}
                onChangeText={(text) => handleInputChange(index, "issueQty", text)}
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
            onPress={() => navigation.navigate("IssueGeneralData")}
          >
            <Text style={styles.buttonText}>Show Issue General Data</Text>
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
            <Text style={styles.modalText}>Issue created successfully.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate("IssueGeneralData");
              }}
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

export default IssueGeneral;