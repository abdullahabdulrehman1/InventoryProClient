import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormFields from "../../common/FormFields";
import FormRows from "../../common/FormRows";
import { useUpdatePurchaseOrderMutation } from "../../redux/api/poGeneralApi";
import ButtonStyles from "../../styles/ButtonStyles";
import ContainerStyles from "../../styles/ContainerStyles";
import FormStyles from "../../styles/FormStyles";
import ModalStyles from "../../styles/ModalStyles";
import ReusableModal from "../../utils/ReusableModal";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const POGeneralEdit = ({ navigation, route }) => {
  const { po } = route.params;
  const [rows, setRows] = useState(po.rows || []);
  const [formValues, setFormValues] = useState({
    poNumber: po.poNumber || "",
    date: formatDate(po.date) || "",
    poDelivery: formatDate(po.poDelivery) || "",
    requisitionType: po.requisitionType || "Standard",
    requisitionRequired: po.requisitionRequired || "No",
    requisitionNumber: po.requisitionNumber || "",
    supplier: po.supplier || "",
    store: po.store || "",
    payment: po.payment || "",
    purchaser: po.purchaser || "",
    remarks: po.remarks || "",
  });
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRowInputChange = (index, name, value) => {
    const values = rows.map((row, i) => (i === index ? { ...row, [name]: value } : row));
    setRows(values);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        prNo: "",
        department: "",
        category: "",
        name: "",
        uom: "",
        quantity: "",
        rate: "",
        gstPercent: "",
        discountAmount: "",
        otherChargesAmount: "",
        rowRemarks: "",
      },
    ]);
  };

  const removeRow = (index) => {
    const values = rows.filter((_, i) => i !== index);
    setRows(values);
  };

  const validateDate = (date) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(date);
  };

  const validateForm = () => {
    if (!formValues.poNumber) {
      Alert.alert("Validation Error", "PO Number is required.");
      return false;
    }
    if (!validateDate(formValues.date)) {
      Alert.alert("Validation Error", "Invalid date format. Use DD-MM-YYYY.");
      return false;
    }
    if (!validateDate(formValues.poDelivery)) {
      Alert.alert(
        "Validation Error",
        "Invalid PO Delivery date format. Use DD-MM-YYYY."
      );
      return false;
    }
    if (!formValues.requisitionType) {
      Alert.alert("Validation Error", "Requisition Type is required.");
      return false;
    }
    if (!formValues.requisitionRequired) {
      Alert.alert("Validation Error", "Requisition Required is required.");
      return false;
    }
    if (formValues.requisitionRequired === "Yes" && !formValues.requisitionNumber) {
      Alert.alert("Validation Error", "Requisition Number is required.");
      return false;
    }
    if (!formValues.supplier) {
      Alert.alert("Validation Error", "Supplier is required.");
      return false;
    }
    if (!formValues.store) {
      Alert.alert("Validation Error", "Store is required.");
      return false;
    }
    if (!formValues.payment) {
      Alert.alert("Validation Error", "Payment is required.");
      return false;
    }
    if (!formValues.purchaser) {
      Alert.alert("Validation Error", "Purchaser is required.");
      return false;
    }
    if (!formValues.remarks) {
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
    const user = await SecureStore.getItemAsync("user");
    const userId = JSON.parse(user)._id;
    const [day, month, year] = formValues.date.split("-");
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
    const [deliveryDay, deliveryMonth, deliveryYear] = formValues.poDelivery.split("-");
    const isoPoDelivery = new Date(`${deliveryYear}-${deliveryMonth}-${deliveryDay}`).toISOString();

    const updateData = {
      userId,
      poNumber: formValues.poNumber,
      date: isoDate,
      poDelivery: isoPoDelivery,
      requisitionType: formValues.requisitionType,
      requisitionRequired: formValues.requisitionRequired,
      requisitionNumber: formValues.requisitionRequired === "Yes" ? formValues.requisitionNumber : undefined,
      supplier: formValues.supplier,
      store: formValues.store,
      payment: formValues.payment,
      purchaser: formValues.purchaser,
      remarks: formValues.remarks,
      rows: rows.map(({ prNo, department, category, name, uom, quantity, rate, gstPercent, discountAmount, otherChargesAmount, rowRemarks }) => ({
        prNo,
        department,
        category,
        name,
        uom,
        quantity: Number(quantity),
        rate: Number(rate),
        gstPercent: Number(gstPercent),
        discountAmount: Number(discountAmount),
        otherChargesAmount: Number(otherChargesAmount),
        rowRemarks,
      })),
    };

    console.log("Data being sent to API:", updateData);

    try {
      const response = await updatePurchaseOrder({
        userId,
        purchaseOrderId: po._id,
        updateData,
      }).unwrap();

      if (response) {
        setSuccessModalVisible(true);
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } catch (error) {
      console.error("Error response:", error);
      if (error.data) {
        Alert.alert("Error", error.data.message || "Something went wrong.");
      } else {
        Alert.alert("Error", "No response received from server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate("POGTabs",{
      screen: 'Data',
      params: {
        shouldRefresh: true // Optional: Add any refresh flags if needed
      }
    });
  };

  const formFields = [
    { name: "poNumber", label: "PO #", placeholder: "Enter PO #", type: "text", icon: "document-text-outline" },
    { name: "date", label: "Date", placeholder: "Enter Date (DD-MM-YYYY)", type: "date", icon: "calendar-outline" },
    { name: "poDelivery", label: "PO Delivery", placeholder: "Enter PO Delivery Date", type: "date", icon: "calendar-outline" },
    {
      name: "requisitionType", label: "Requisition Type", placeholder: "Select Requisition Type", type: "picker", icon: "list-outline", options: [
        { label: "Select Requisition Type", value: "" },
        { label: "Standard", value: "Standard" },
        { label: "Urgent", value: "Urgent" },
      ]
    },
    {
      name: "requisitionRequired", label: "Requisition Required", placeholder: "Select Yes or No", type: "picker", icon: "list-outline", options: [
        { label: "No", value: "No" },
        { label: "Yes", value: "Yes" },
      ]
    },
    { name: "supplier", label: "Supplier", placeholder: "Enter Supplier", type: "text", icon: "business-outline" },
    { name: "store", label: "Store", placeholder: "Enter Store", type: "text", icon: "storefront-outline" },
    { name: "payment", label: "Payment", placeholder: "Enter Payment", type: "text", icon: "card-outline" },
    { name: "purchaser", label: "Purchaser", placeholder: "Enter Purchaser", type: "text", icon: "person-outline" },
    { name: "remarks", label: "Remarks", placeholder: "Enter Remarks", type: "text", icon: "chatbox-ellipses-outline" },
  ];

  if (formValues.requisitionRequired === "Yes") {
    formFields.splice(5, 0, { name: "requisitionNumber", label: "Requisition Number", placeholder: "Enter Requisition Number", type: "text", icon: "document-text-outline" });
  }

  const rowFields = [
    { name: "prNo", label: "PR No", placeholder: "PR No", type: "text" },
    { name: "department", label: "Department", placeholder: "Department", type: "text" },
    { name: "category", label: "Category", placeholder: "Category", type: "text" },
    { name: "name", label: "Item Name", placeholder: "Item Name", type: "text" },
    { name: "uom", label: "UOM", placeholder: "UOM", type: "text" },
    { name: "quantity", label: "Quantity", placeholder: "Quantity", type: "number" },
    { name: "rate", label: "Rate", placeholder: "Rate", type: "number" },
    { name: "gstPercent", label: "GST Percent", placeholder: "GST Percent", type: "number" },
    { name: "discountAmount", label: "Discount Amount", placeholder: "Discount Amount", type: "number" },
    { name: "otherChargesAmount", label: "Other Charges Amount", placeholder: "Other Charges Amount", type: "number" },
    { name: "rowRemarks", label: "Remarks", placeholder: "Remarks", type: "text" },
  ];

  return (
    <View>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() =>   navigation.navigate("POGTabs",{
      screen: 'Data',
      params: {
        shouldRefresh: true // Optional: Add any refresh flags if needed
      }
    })}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Purchase Order</Text>
        </View>
        <FormFields fields={formFields} values={formValues} onChange={handleInputChange} errors={{}} />
        <FormRows rows={rows} rowFields={rowFields} handleRowInputChange={handleRowInputChange} removeRow={removeRow} errors={{}} />
        <View style={styles.buttonContainer}>
          <Button title="Add Row" onPress={addRow} color="#1b1f26" />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ReusableModal
        visible={successModalVisible}
        onClose={handleSuccessModalClose}
        headerText="Success"
        bodyText="Purchase Order updated successfully."
        buttonText="OK"
        onButtonPress={handleSuccessModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ...ContainerStyles,
  ...ButtonStyles,
  ...FormStyles,
  ...ModalStyles,
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default POGeneralEdit;