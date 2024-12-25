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

const IssueReturnGeneral = ({ navigation }) => {
  const [irNumber, setIrNumber] = useState("");
  const [irDate, setIrDate] = useState("");
  const [drNumber, setDrNumber] = useState("");
  const [drDate, setDrDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [rows, setRows] = useState([
    {
      action: "",
      serialNo: "",
      level3ItemCategory: "",
      itemName: "",
      unit: "",
      issueQty: "",
      previousReturnQty: "",
      balanceIssueQty: "",
      returnQty: "",
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
        unit: "",
        issueQty: "",
        previousReturnQty: "",
        balanceIssueQty: "",
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

  const validateDate = (date) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(date);
  };

  const handleSubmit = async () => {
    if (!validateDate(irDate) || !validateDate(drDate)) {
      Alert.alert("Error", "Please enter dates in the format dd-mm-yyyy.");
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");
    const userId = JSON.parse(user)._id;
    const items = rows;
    const [irDay, irMonth, irYear] = irDate.split("-");
    const isoIrDate = new Date(`${irYear}-${irMonth}-${irDay}`).toISOString();
    const [drDay, drMonth, drYear] = drDate.split("-");
    const isoDrDate = new Date(`${drYear}-${drMonth}-${drDay}`).toISOString();

    try {
      const response = await axios.post(`${ServerUrl}/issueReturnGeneral/create-issue-return-general`, {
        token,
        userId,
        irNumber,
        irDate: isoIrDate,
        drNumber,
        drDate: isoDrDate,
        remarks,
        rows: items,
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
            <Text style={styles.label}>IR #</Text>
          </View>
          <TextInput
            style={styles.input}
            value={irNumber}
            onChangeText={setIrNumber}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>IR Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={irDate}
            onChangeText={setIrDate}
            placeholder="dd-mm-yyyy"
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>DR #</Text>
          </View>
          <TextInput
            style={styles.input}
            value={drNumber}
            onChangeText={setDrNumber}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>DR Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={drDate}
            onChangeText={setDrDate}
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
              <Text style={styles.rowLabel}>Unit</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Unit"
                value={row.unit}
                onChangeText={(text) => handleInputChange(index, "unit", text)}
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
              <Text style={styles.rowLabel}>Previous Return Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Previous Return Qty"
                value={row.previousReturnQty}
                onChangeText={(text) => handleInputChange(index, "previousReturnQty", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Balance Issue Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Balance Issue Qty"
                value={row.balanceIssueQty}
                onChangeText={(text) => handleInputChange(index, "balanceIssueQty", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.rowLabel}>Return Qty</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="Return Qty"
                value={row.returnQty}
                onChangeText={(text) => handleInputChange(index, "returnQty", text)}
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
            onPress={() => navigation.navigate("IssueReturnGeneralData")}
          >
            <Text style={styles.buttonText}>Show Issue Return General Data</Text>
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
            <Text style={styles.modalText}>Issue Return created successfully.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate("IssueReturnGeneralData");
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

export default IssueReturnGeneral;