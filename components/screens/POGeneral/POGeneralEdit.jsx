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
import { validateForm } from "../../utils/formValidation";
import ReusableModal from "../../utils/ReusableModal";
import { poFields, rowFields } from "./POGeneralFields";
import { poGeneralValidationRules } from "./POGeneralValidation";

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
    supplier: po.supplier || "",
    store: po.store || "",
    payment: po.payment || "",
    purchaser: po.purchaser || "",
    remarks: po.remarks || "",
  });
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();

  useEffect(() => {
    const formData = {
      ...formValues,
      rows,
    };
    const validationErrors = validateForm(formData, poGeneralValidationRules);
    setErrors(validationErrors);
    setIsFormValid(Object.keys(validationErrors).length === 0);
  }, [formValues, rows]);

  useEffect(() => {
    if (isSubmitted) {
      const formData = {
        ...formValues,
        rows,
      };
      const validationErrors = validateForm(formData, poGeneralValidationRules);
      setErrors(validationErrors);
      setIsFormValid(Object.keys(validationErrors).length === 0);
    }
  }, [formValues, rows, isSubmitted]);

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    setIsSubmitted(true);
  };

  const handleRowInputChange = (index, name, value) => {
    const values = rows.map((row, i) => (i === index ? { ...row, [name]: value } : row));
    setRows(values);
    setIsSubmitted(true);
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

  const handleSubmit = async () => {
    if (!isFormValid) {
      const errorMessages = Object.values(errors).flat().join("\n");
      Alert.alert("Validation Errors", errorMessages);
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
    navigation.navigate("POGeneralData");
  };

  return (
    <View>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("POGeneralData")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Purchase Order</Text>
        </View>
        <FormFields fields={poFields} values={formValues} onChange={handleInputChange} errors={isSubmitted ? errors : {}} />
        <FormRows rows={rows} rowFields={rowFields} handleRowInputChange={handleRowInputChange} removeRow={removeRow} errors={errors} isSubmitted={isSubmitted} />
        <View style={styles.buttonContainer}>
          <Button title="Add Row" onPress={addRow} color="#1b1f26" />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
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