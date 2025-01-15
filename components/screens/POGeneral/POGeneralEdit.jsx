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
import * as SecureStore from "expo-secure-store";
const POGeneralEdit = ({ navigation, route }) => {
  const { po } = route.params; // Assuming PO data is passed via route params

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [rows, setRows] = useState(po.rows || []);
  const [poNumber, setPoNumber] = useState(po.poNumber || "");
  const [date, setDate] = useState(formatDate(po.date) || "");
  const [poDelivery, setPoDelivery] = useState(formatDate(po.poDelivery) || "");
  const [requisitionType, setRequisitionType] = useState(
    po.requisitionType || "Standard"
  );
  const [supplier, setSupplier] = useState(po.supplier || "");
  const [store, setStore] = useState(po.store || "");
  const [payment, setPayment] = useState(po.payment || "");
  const [purchaser, setPurchaser] = useState(po.purchaser || "");
  const [remarks, setRemarks] = useState(po.remarks || "");
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
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [name]: value } : row
    );
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = await SecureStore.getItemAsnyc("token");
    const user = await SecureStore.getItemAsnyc("user");
    const userId = JSON.parse(user)._id;
    const items = rows;
    const [day, month, year] = date.split("-");
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
    const [deliveryDay, deliveryMonth, deliveryYear] = poDelivery.split("-");
    const isoPoDelivery = new Date(
      `${deliveryYear}-${deliveryMonth}-${deliveryDay}`
    ).toISOString();

    try {
      const response = await axios.put(
        `${ServerUrl}/poGeneral/editPurchaseOrder`,
        {
          userId,
          purchaseOrderId: po._id,
          updateData: {
            userId,
            poNumber,
            date: isoDate,
            poDelivery: isoPoDelivery,
            requisitionType,
            supplier,
            store,
            payment,
            purchaser,
            remarks,
            rows: items,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        routes: [{ name: "POGeneral" }],
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
            onPress={() => navigation.navigate("POGeneralData")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Purchase Order</Text>
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>PO Number</Text>
          </View>
          <TextInput
            style={styles.input}
            value={poNumber}
            onChangeText={setPoNumber}
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
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>PO Delivery</Text>
          </View>
          <TextInput
            style={styles.input}
            value={poDelivery}
            onChangeText={setPoDelivery}
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
            <Ionicons name="storefront-outline" size={20} color="black" />
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
            <Ionicons name="card-outline" size={20} color="black" />
            <Text style={styles.label}>Payment</Text>
          </View>
          <TextInput
            style={styles.input}
            value={payment}
            onChangeText={setPayment}
            required
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
            <Text style={styles.rowFieldLabel}>PR No</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="PR No"
              value={row.prNo}
              onChangeText={(text) => handleInputChange(index, "prNo", text)}
            />
            <Text style={styles.rowFieldLabel}>Department</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Department"
              value={row.department}
              onChangeText={(text) =>
                handleInputChange(index, "department", text)
              }
            />
            <Text style={styles.rowFieldLabel}>Category</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Category"
              value={row.category}
              onChangeText={(text) =>
                handleInputChange(index, "category", text)
              }
            />
            <Text style={styles.rowFieldLabel}>Item Name</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Item Name"
              value={row.name}
              onChangeText={(text) => handleInputChange(index, "name", text)}
            />
            <Text style={styles.rowFieldLabel}>UOM</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="UOM"
              value={row.uom}
              onChangeText={(text) => handleInputChange(index, "uom", text)}
            />
            <Text style={styles.rowFieldLabel}>Quantity</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Quantity"
              value={String(row.quantity)}
              onChangeText={(text) =>
                handleInputChange(index, "quantity", text)
              }
              keyboardType="numeric"
            />
            <Text style={styles.rowFieldLabel}>Rate</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Rate"
              value={String(row.rate)}
              onChangeText={(text) => handleInputChange(index, "rate", text)}
              keyboardType="numeric"
            />
            <Text style={styles.rowFieldLabel}>Discount Amount</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Discount Amount"
              value={String(row.discountAmount)}
              onChangeText={(text) =>
                handleInputChange(index, "discountAmount", text)
              }
              keyboardType="numeric"
            />
            <Text style={styles.rowFieldLabel}>Other Charges Amount</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="Other Charges Amount"
              value={String(row.otherChargesAmount)}
              onChangeText={(text) =>
                handleInputChange(index, "otherChargesAmount", text)
              }
              keyboardType="numeric"
            />
            <Text style={styles.rowFieldLabel}>Remarks</Text>
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
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Success</Text>
            <Text style={styles.modalText}>
              Purchase Order updated successfully.
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
  rowFieldLabel: {
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

export default POGeneralEdit;
