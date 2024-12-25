import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateForm } from "../../utils/formValidation";
import { poGeneralValidationRules } from "./POGeneralValidation";
import FormFields from "../../common/FormFields";
import FormRows from "../../common/FormRows";
import { poGeneralFields, poRowFields } from "./POGeneralFields";
import ReusableModal from "../../utils/ReusableModal.jsx";
import ContainerStyles from "../../styles/ContainerStyles.js";
import ButtonStyles from "../../styles/ButtonStyles.js";
import FormStyles from "../../styles/FormStyles.js";
import ModalStyles from "../../styles/ModalStyles.js";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import { ServerUrl } from "../../config/ServerUrl.jsx";

const POGeneral = ({ navigation }) => {
  const [rows, setRows] = useState([
    {
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
  const [formValues, setFormValues] = useState({
    poNumber: "",
    date: "",
    poDelivery: "",
    requisitionType: "Select Requisition Type",
    supplier: "",
    store: "",
    payment: "",
    purchaser: "",
    remarks: "",
  });
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Define isLoading state

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
    const values = rows.map((row, i) =>
      i === index ? { ...row, [name]: value } : row
    );
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
    setIsLoading(true); // Set loading state to true
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");
    const userId = JSON.parse(user)._id;
    const items = rows;
    const [day, month, year] = formValues.date.split("-");
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString();

    try {
      const response = await axios.post(`${ServerUrl}/poGeneral/createPO`, {
        token,
        userId,
        poNumber: formValues.poNumber,
        date: isoDate,
        poDelivery: formValues.poDelivery,
        requisitionType: formValues.requisitionType,
        supplier: formValues.supplier,
        store: formValues.store,
        payment: formValues.payment,
        purchaser: formValues.purchaser,
        remarks: formValues.remarks,
        items,
      });
      console.log(response.data);
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Error response:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors
          .map((err) => err.msg)
          .join("\n");
        Alert.alert("Error", errorMessages);
      } else {
        Alert.alert("Error", error.message || "Something went wrong.");
      }
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "POGeneralData" }],
      })
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormFields
          fields={poGeneralFields}
          values={formValues}
          onChange={handleInputChange}
          errors={isSubmitted ? errors : {}}
        />
        <FormRows
          rows={rows}
          rowFields={poRowFields}
          handleRowInputChange={handleRowInputChange}
          removeRow={removeRow}
          errors={errors}
          isSubmitted={isSubmitted}
          showLabels={true} // Show labels for row fields
        />
        <View style={styles.buttonContainer}>
          <Button title="Add Row" onPress={addRow} color="#1b1f26" />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              (!isFormValid || isLoading) && styles.buttonDisabled,
            ]}
            onPress={() => {
              if (!isFormValid) {
                const errorMessages = Object.values(errors).flat().join("\n");
                Alert.alert("Validation Errors", errorMessages);
              } else {
                handleSubmit();
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("POGeneralData")}
          >
            <Text style={styles.buttonText}>Show PO Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ReusableModal
        visible={successModalVisible}
        onClose={handleSuccessModalClose}
        headerText="Success"
        bodyText="Purchase Order created successfully."
        buttonText="OK"
        onButtonPress={handleSuccessModalClose}
      />
    </KeyboardAvoidingView>
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

export default POGeneral;
