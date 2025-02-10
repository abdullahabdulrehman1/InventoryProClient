import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ServerUrl from "../../config/ServerUrl";
import ReusableModal from "../../utils/ReusableModal";
import ReusableButton from "../../utils/reusableButton";
import FormRows from "../../common/FormRows";
import FormFields from "../../common/FormFields";

const GRNGeneralEdit = ({ navigation, route }) => {
  const { grn } = route.params; // Assuming GRN data is passed via route params

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`).toISOString();
  };

  const [formValues, setFormValues] = useState({
    grnNumber: grn.grnNumber || "",
    date: formatDate(grn.date) || "",
    supplierChallanNumber: grn.supplierChallanNumber || "",
    supplierChallanDate: formatDate(grn.supplierChallanDate) || "",
    supplier: grn.supplier || "",
    inwardNumber: grn.inwardNumber || "",
    inwardDate: formatDate(grn.inwardDate) || "",
    remarks: grn.remarks || "",
  });

  const [rows, setRows] = useState(grn.rows || []);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const formFields = [
    { name: "grnNumber", label: "GRN Number", placeholder: "GRN Number", type: "text", icon: "document-text-outline" },
    { name: "date", label: "Date", placeholder: "dd-mm-yyyy", type: "text", icon: "calendar-outline" },
    { name: "supplierChallanNumber", label: "Supplier Challan Number", placeholder: "Supplier Challan Number", type: "text", icon: "document-text-outline" },
    { name: "supplierChallanDate", label: "Supplier Challan Date", placeholder: "dd-mm-yyyy", type: "text", icon: "calendar-outline" },
    { name: "supplier", label: "Supplier", placeholder: "Supplier", type: "text", icon: "business-outline" },
    { name: "inwardNumber", label: "Inward Number", placeholder: "Inward Number", type: "text", icon: "document-text-outline" },
    { name: "inwardDate", label: "Inward Date", placeholder: "dd-mm-yyyy", type: "text", icon: "calendar-outline" },
    { name: "remarks", label: "Remarks", placeholder: "Remarks", type: "text", icon: "chatbox-ellipses-outline" },
  ];

  const rowFields = [
    { name: "poNo", label: "PO Number", placeholder: "PO Number", type: "text" },
    { name: "department", label: "Department", placeholder: "Department", type: "text" },
    { name: "category", label: "Category", placeholder: "Category", type: "text" },
    { name: "name", label: "Item Name", placeholder: "Item Name", type: "text" },
    { name: "unit", label: "Unit", placeholder: "Unit", type: "text" },
    { name: "poQty", label: "PO Quantity", placeholder: "PO Quantity", type: "number" },
    { name: "previousQty", label: "Previous Quantity", placeholder: "Previous Quantity", type: "number" },
    { name: "balancePoQty", label: "Balance PO Quantity", placeholder: "Balance PO Quantity", type: "number" },
    { name: "receivedQty", label: "Received Quantity", placeholder: "Received Quantity", type: "number" },
    { name: "rowRemarks", label: "Row Remarks", placeholder: "Row Remarks", type: "text" },
  ];

  const handleFormChange = (name, value) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

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
      !formValues.grnNumber ||
      !formValues.date ||
      !formValues.supplierChallanNumber ||
      !formValues.supplierChallanDate ||
      !formValues.supplier ||
      !formValues.inwardNumber ||
      !formValues.inwardDate ||
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
      !validateDate(formValues.date) ||
      !validateDate(formValues.supplierChallanDate) ||
      !validateDate(formValues.inwardDate)
    ) {
      Alert.alert("Error", "Please enter dates in the format dd-mm-yyyy.");
      return;
    }

    setLoading(true);
    const token = await SecureStore.getItemAsync("token");
    const user = await SecureStore.getItemAsync("user");
    const userId = JSON.parse(user)._id;
    const items = rows;
    const isoDate = parseDate(formValues.date);
    const isoChallanDate = parseDate(formValues.supplierChallanDate);
    const isoInwardDate = parseDate(formValues.inwardDate);
    try {
      const response = await axios.put(`${ServerUrl}/grnGeneral/update-grn`, {
        userId,
        id: grn._id,
        grnNumber: formValues.grnNumber,
        date: isoDate,
        supplierChallanNumber: formValues.supplierChallanNumber,
        supplierChallanDate: isoChallanDate,
        supplier: formValues.supplier,
        inwardNumber: formValues.inwardNumber,
        inwardDate: isoInwardDate,
        remarks: formValues.remarks,
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
        setErrorMessages([response.data.message]);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      if (error.response) {
        setErrorMessages([error.response.data.message]);
      } else if (error.request) {
        setErrorMessages(["No response received from server."]);
      } else {
        setErrorMessages([error.message]);
      }
      setErrorModalVisible(true);
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
                  <TouchableOpacity onPress={() => navigation.navigate("GRNGeneral")}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.header}>GRN General Edit</Text>
                </View>
        <FormFields
          fields={formFields}
          values={formValues}
          onChange={handleFormChange}
          errors={{}}
        />
        <FormRows
          rows={rows}
          rowFields={rowFields}
          handleRowInputChange={handleInputChange}
          removeRow={removeRow}
          errors={{}}
          isSubmitted={false}
        />
        <ReusableButton onPress={addRow} text="Add Row" loading={false} />
        <ReusableButton onPress={handleSubmit} text="Update" loading={loading} />
      </ScrollView>

      <ReusableModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        headerText="Success"
        bodyText="GRN updated successfully."
        buttonText="OK"
        onButtonPress={handleSuccessModalClose}
      />

      <ReusableModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        headerText="Error"
        bodyText={errorMessages.length > 0 ? errorMessages[0] : ""}
        buttonText="OK"
        onButtonPress={() => setErrorModalVisible(false)}
      />
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
  headerContainer:{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  header:{
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  }
});

export default GRNGeneralEdit;