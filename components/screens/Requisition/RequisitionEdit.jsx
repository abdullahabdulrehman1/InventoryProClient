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

const RequisitionEdit = ({ navigation, route }) => {
  const { requisition } = route.params; // Assuming requisition data is passed via route params

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [rows, setRows] = useState(requisition.items || []);
  const [drNumber, setDrNumber] = useState(requisition.drNumber || "");
  const [date, setDate] = useState(formatDate(requisition.date) || "");
  const [department, setDepartment] = useState(requisition.department || "");
  const [headerRemarks, setHeaderRemarks] = useState(
    requisition.headerRemarks || ""
  );
  const [requisitionType, setRequisitionType] = useState(
    requisition.requisitionType || "Purchase Requisition"
  );
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        level3ItemCategory: "",
        itemName: "",
        uom: "",
        quantity: "",
        rate: "",
        amount: "",
        remarks: "",
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

  const handleSubmit = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");
    const userId = JSON.parse(user)._id;
    const items = rows;
    const [day, month, year] = date.split("-");
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString();

    try {
      const response = await axios.put(
        `${ServerUrl}/requisition/updateRequisition`,
        {
          token,
          requisitionId: requisition._id,
          updateData: {
            userId,
            drNumber,
            date: isoDate,
            department,
            headerRemarks,
            requisitionType,
            items,
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
        routes: [{ name: "RequisitionData" }],
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
            onPress={() => navigation.navigate("RequisitionData")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Requisition</Text>
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
            <Ionicons name="business-outline" size={20} color="black" />
            <Text style={styles.label}>Department</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={department}
              style={styles.picker}
              onValueChange={(itemValue) => setDepartment(itemValue)}
            >
              <Picker.Item label="Sales" value="Sales" />
              <Picker.Item label="Marketing" value="Marketing" />
              <Picker.Item label="Finance" value="Finance" />
              <Picker.Item label="HR" value="HR" />
            </Picker>
          </View>
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={20} color="black" />
            <Text style={styles.label}>Remarks</Text>
          </View>
          <TextInput
            style={styles.input}
            value={headerRemarks}
            onChangeText={setHeaderRemarks}
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
              <Picker.Item
                label="Purchase Requisition"
                value="Purchase Requisition"
              />
              <Picker.Item
                label="Store Requisition"
                value="Store Requisition"
              />
            </Picker>
          </View>
        </View>
        {rows.map((row, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.rowLabel}>Row {index + 1}</Text>
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
              placeholder="Uom"
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
              placeholder="Estimated Rate"
              value={String(row.rate)}
              onChangeText={(text) => handleInputChange(index, "rate", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Estimated Amount"
              value={String(row.amount)}
              onChangeText={(text) => handleInputChange(index, "amount", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.rowInput}
              placeholder="Remarks"
              value={row.remarks}
              onChangeText={(text) => handleInputChange(index, "remarks", text)}
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
            onPress={() => navigation.navigate("RequisitionData")}
          >
            <Text style={styles.buttonText}>Show Requisition Data</Text>
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
              Requisition updated successfully.
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

export default RequisitionEdit;
