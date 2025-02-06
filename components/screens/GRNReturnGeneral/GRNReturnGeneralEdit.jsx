import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet
} from "react-native";
import FormFields from "../../common/FormFields";
import FormRows from "../../common/FormRows";
import ServerUrl from "../../config/ServerUrl";
import { validateForm, validationMethods } from "../../utils/formValidation";
import ReusableButton from "../../utils/reusableButton";
import ReusableModal from "../../utils/ReusableModal";

const GRNReturnGeneralEdit = ({ navigation, route }) => {
  const { grnReturn } = route.params; // Assuming GRN Return data is passed via route params

  const [formValues, setFormValues] = useState({
    grnrNumber: grnReturn.grnrNumber || "",
    grnrDate: grnReturn.grnrDate || "",
    grnNumber: grnReturn.grnNumber || "",
    grnDate: grnReturn.grnDate || "",
    remarks: grnReturn.remarks || "",
  });
  const [rows, setRows] = useState(grnReturn.rows.map(row => ({ ...row })) || []);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formFields = [
    { name: "grnrNumber", label: "GRNR Number", icon: "document-text-outline", type: "text" },
    { name: "grnrDate", label: "GRNR Date", icon: "calendar-outline", type: "text", placeholder: "dd-mm-yyyy" },
    { name: "grnNumber", label: "GRN Number", icon: "document-text-outline", type: "text" },
    { name: "grnDate", label: "GRN Date", icon: "calendar-outline", type: "text", placeholder: "dd-mm-yyyy" },
    { name: "remarks", label: "Remarks", icon: "chatbox-ellipses-outline", type: "text" },
  ];

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRowInputChange = (index, name, value) => {
    const newRows = rows.map((row, i) =>
      i === index ? { ...row, [name]: value } : row
    );
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        action: "",
        serialNo: "",
        category: "",
        name: "",
        unit: "",
        grnQty: "",
        previousReturnQty: "",
        balanceGrnQty: "",
        returnQty: "",
        rowRemarks: "",
      },
    ]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
    } else {
      Alert.alert("Error", "At least one row is required.");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const validationRules = [
      {
        field: "grnrNumber",
        validations: [{ method: validationMethods.required, message: "GRNR Number is required" }],
      },
      {
        field: "grnrDate",
        validations: [{ method: validationMethods.required, message: "GRNR Date is required" }, { method: validationMethods.validateDate, message: "GRNR Date must be in dd-mm-yyyy format" }],
      },
      {
        field: "grnNumber",
        validations: [{ method: validationMethods.required, message: "GRN Number is required" }],
      },
      {
        field: "grnDate",
        validations: [{ method: validationMethods.required, message: "GRN Date is required" }, { method: validationMethods.validateDate, message: "GRN Date must be in dd-mm-yyyy format" }],
      },
      {
        field: "remarks",
        validations: [{ method: validationMethods.required, message: "Remarks are required" }],
      },
      {
        field: "rows",
        validations: {
          action: [{ method: validationMethods.required, message: "Action is required" }],
          serialNo: [{ method: validationMethods.required, message: "Serial No is required" }],
          category: [{ method: validationMethods.required, message: "Category is required" }],
          name: [{ method: validationMethods.required, message: "Name is required" }],
          unit: [{ method: validationMethods.required, message: "Unit is required" }],
          grnQty: [{ method: validationMethods.required, message: "GRN Qty is required" }, { method: validationMethods.isNumber, message: "GRN Qty must be a number" }],
          previousReturnQty: [{ method: validationMethods.required, message: "Previous Return Qty is required" }, { method: validationMethods.isNumber, message: "Previous Return Qty must be a number" }],
          balanceGrnQty: [{ method: validationMethods.required, message: "Balance GRN Qty is required" }, { method: validationMethods.isNumber, message: "Balance GRN Qty must be a number" }],
          returnQty: [{ method: validationMethods.required, message: "Return Qty is required" }, { method: validationMethods.isNumber, message: "Return Qty must be a number" }],
          rowRemarks: [{ method: validationMethods.maxLength, args: [150], message: "Row Remarks must be less than 150 characters" }],
        },
      },
    ];

    const formData = {
      ...formValues,
      rows,
    };
    const validationErrors = validateForm(formData, validationRules);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync("token");
        const user = await SecureStore.getItemAsync("user");
        const userId = JSON.parse(user)._id;
        const response = await axios.put(
          `${ServerUrl}/grnReturnGeneral/edit-grn-return-general`,
          {
            userId,
            id: grnReturn._id,
            ...formValues,
            rows,
          }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        if (response.status === 200) {
          setSuccessModalVisible(true);
        } else {
          setErrorMessage(response.data.message || "Something went wrong.");
          setErrorModalVisible(true);
        }
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage(`Something went wrong. ${error.message}`);
        }
        setErrorModalVisible(true);
      } finally {
        setLoading(false);
      }
    } else {
      const firstError = Object.values(validationErrors)[0];
      setErrorMessage(firstError);
      setErrorModalVisible(true);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "GRNReturnGeneralData" }],
      })
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FormFields
        fields={formFields}
        values={formValues}
        onChange={handleInputChange}
        errors={errors}
      />
      <FormRows
        rows={rows}
        rowFields={[
          { name: "action", label: "Action", placeholder: "Action" },
          { name: "serialNo", label: "Serial No", placeholder: "Serial No" },
          { name: "category", label: "Category", placeholder: "Category" },
          { name: "name", label: "Name", placeholder: "Name" },
          { name: "unit", label: "Unit", placeholder: "Unit" },
          { name: "grnQty", label: "GRN Qty", placeholder: "GRN Qty", type: "number" },
          { name: "previousReturnQty", label: "Previous Return Qty", placeholder: "Previous Return Qty", type: "number" },
          { name: "balanceGrnQty", label: "Balance GRN Qty", placeholder: "Balance GRN Qty", type: "number" },
          { name: "returnQty", label: "Return Qty", placeholder: "Return Qty", type: "number" },
          { name: "rowRemarks", label: "Row Remarks", placeholder: "Row Remarks" },
        ]}
        handleRowInputChange={handleRowInputChange}
        removeRow={removeRow}
        errors={errors}
        isSubmitted={isSubmitted}
      />
      <ReusableButton onPress={addRow} text="Add Row" />
      <ReusableButton onPress={handleSubmit} loading={loading} text="Submit" />
      <ReusableButton onPress={() => navigation.navigate("GRNReturnGeneralData")} text="Show GRN Return General Data" />
      <ReusableModal
        visible={successModalVisible}
        onClose={handleSuccessModalClose}
        headerText="Success"
        bodyText="GRN Return updated successfully."
        buttonText="OK"
        onButtonPress={handleSuccessModalClose}
      />
      <ReusableModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        headerText="Error"
        bodyText={errorMessage}
        buttonText="OK"
        onButtonPress={() => setErrorModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default GRNReturnGeneralEdit;