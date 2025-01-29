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
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ServerUrl from "../../config/ServerUrl";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store'
const IssueGeneralEdit = ({ navigation, route }) => {
  const { issue } = route.params; // Assuming issue data is passed via route params

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [rows, setRows] = useState(issue.rows.map((row) => ({ ...row })) || []);
  const [grnNumber, setGrnNumber] = useState(issue.grnNumber || "");
  const [issueDate, setIssueDate] = useState(formatDate(issue.issueDate) || "");
  const [store, setStore] = useState(issue.store || "");
  const [requisitionType, setRequisitionType] = useState(
    issue.requisitionType || "On Requisition"
  );
  const [issueToUnit, setIssueToUnit] = useState(issue.issueToUnit || "");
  const [demandNo, setDemandNo] = useState(issue.demandNo || "");
  const [vehicleType, setVehicleType] = useState(issue.vehicleType || "");
  const [issueToDepartment, setIssueToDepartment] = useState(
    issue.issueToDepartment || ""
  );
  const [vehicleNo, setVehicleNo] = useState(issue.vehicleNo || "");
  const [driver, setDriver] = useState(issue.driver || "");
  const [remarks, setRemarks] = useState(issue.remarks || "");
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
    const values = rows.map((row) => ({ ...row })); // Create a deep copy of rows
    values.splice(index, 1);
    setRows(values);
  };

  const handleInputChange = (index, name, value) => {
    const values = rows.map((row) => ({ ...row })); // Create a deep copy of rows
    values[index][name] = value;
    setRows(values);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = await SecureStore.getItemAsync("token");
    const user = await SecureStore.getItemAsync("user");
    const userId = JSON.parse(user)._id;
    const [day, month, year] = issueDate.split("-");
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString();

    try {
      const response = await axios.put(
        `${ServerUrl}/issueGeneral/update-issue-general`,
        {
          token,
          id: issue._id,
          userId,
          grnNumber,
          issueDate: isoDate,
          store,
          requisitionType,
          issueToUnit,
          demandNo,
          vehicleType,
          issueToDepartment,
          vehicleNo,
          driver,
          remarks,
          rows,
        },  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
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
        routes: [{ name: "IssueGeneralData" }],
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
            onPress={() => navigation.navigate("IssueGeneralData")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Issue General</Text>
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
              <Picker.Item label="On Requisition" value="On Requisition" />
              <Picker.Item label="Direct Issue" value="Direct Issue" />
            </Picker>
          </View>
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="business-outline" size={20} color="black" />
            <Text style={styles.label}>Issue To Unit</Text>
          </View>
          <TextInput
            style={styles.input}
            value={issueToUnit}
            onChangeText={setIssueToUnit}
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
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="business-outline" size={20} color="black" />
            <Text style={styles.label}>Issue To Department</Text>
          </View>
          <TextInput
            style={styles.input}
            value={issueToDepartment}
            onChangeText={setIssueToDepartment}
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
            <TextInput
              style={styles.rowInput}
              placeholder="Action"
              value={row.action}
              onChangeText={(text) => handleInputChange(index, "action", text)}
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Serial No"
              value={row.serialNo}
              onChangeText={(text) =>
                handleInputChange(index, "serialNo", text)
              }
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Level 3 Item Category"
              value={row.level3ItemCategory}
              onChangeText={(text) =>
                handleInputChange(index, "level3ItemCategory", text)
              }
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Item Name"
              value={row.itemName}
              onChangeText={(text) =>
                handleInputChange(index, "itemName", text)
              }
            />
            <TextInput
              style={styles.rowInput}
              placeholder="UOM"
              value={row.uom}
              onChangeText={(text) => handleInputChange(index, "uom", text)}
            />
            <TextInput
              style={styles.rowInput}
              placeholder="GRN Qty"
              value={String(row.grnQty)}
              onChangeText={(text) => handleInputChange(index, "grnQty", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Previous Issue Qty"
              value={String(row.previousIssueQty)}
              onChangeText={(text) =>
                handleInputChange(index, "previousIssueQty", text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Balance Qty"
              value={String(row.balanceQty)}
              onChangeText={(text) =>
                handleInputChange(index, "balanceQty", text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Issue Qty"
              value={String(row.issueQty)}
              onChangeText={(text) =>
                handleInputChange(index, "issueQty", text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Row Remarks"
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
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Success</Text>
            <Text style={styles.modalText}>
              Issue General updated successfully.
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
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
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

export default IssueGeneralEdit;
