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

const IssueReturnGeneralEdit = ({ navigation, route }) => {
  const { issueReturn } = route.params; // Assuming issueReturn data is passed via route params

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [rows, setRows] = useState(
    issueReturn.rows.map((row) => ({ ...row })) || []
  );
  const [irNumber, setIrNumber] = useState(issueReturn.irNumber || "");
  const [irDate, setIrDate] = useState(formatDate(issueReturn.irDate) || "");
  const [drNumber, setDrNumber] = useState(issueReturn.drNumber || "");
  const [drDate, setDrDate] = useState(formatDate(issueReturn.drDate) || "");
  const [remarks, setRemarks] = useState(issueReturn.remarks || "");
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
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");
    const userId = JSON.parse(user)._id;
    const [irDay, irMonth, irYear] = irDate.split("-");
    const isoIrDate = new Date(`${irYear}-${irMonth}-${irDay}`).toISOString();
    const [drDay, drMonth, drYear] = drDate.split("-");
    const isoDrDate = new Date(`${drYear}-${drMonth}-${drDay}`).toISOString();

    try {
      const response = await axios.put(
        `${ServerUrl}/issueReturnGeneral/edit-issue-return-general`,
        {
          token,
          userId,
          id: issueReturn._id,
          irNumber,
          irDate: isoIrDate,
          drNumber,
          drDate: isoDrDate,
          remarks,
          rows,
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
        routes: [{ name: "IssueReturnGeneralData" }],
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
            onPress={() => navigation.navigate("IssueReturnGeneralData")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Issue Return General</Text>
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>IR Number</Text>
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
            <Text style={styles.label}>DR Number</Text>
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
              placeholder="Unit"
              value={row.unit}
              onChangeText={(text) => handleInputChange(index, "unit", text)}
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
              placeholder="Previous Return Qty"
              value={String(row.previousReturnQty)}
              onChangeText={(text) =>
                handleInputChange(index, "previousReturnQty", text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Balance Issue Qty"
              value={String(row.balanceIssueQty)}
              onChangeText={(text) =>
                handleInputChange(index, "balanceIssueQty", text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Return Qty"
              value={String(row.returnQty)}
              onChangeText={(text) =>
                handleInputChange(index, "returnQty", text)
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
              Issue Return General updated successfully.
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

export default IssueReturnGeneralEdit;
