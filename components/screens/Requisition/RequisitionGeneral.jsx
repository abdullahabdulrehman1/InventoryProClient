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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ServerUrl from "../../config/ServerUrl";
import { validateForm } from "../../utils/formValidation";
import { requisitionValidationRules } from "./requisitionValidation.js";
import FormFields from "../../common/FormFields";
import FormRows from "../../common/FormRows";
import { requisitionFields, rowFields } from "./requisitionFields";
import ReusableModal from "../../utils/ReusableModal.jsx";
import ContainerStyles from "../../styles/ContainerStyles.js";
import ButtonStyles from "../../styles/ButtonStyles.js";
import FormStyles from "../../styles/FormStyles.js";
import ModalStyles from "../../styles/ModalStyles.js";
import { handleSubmit as handleFormSubmit } from "../../utils/formUtils";

const RequisitionGeneral = ({ navigation }) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      level3ItemCategory: "",
      itemName: "",
      uom: "",
      quantity: "",
      rate: "",
      amount: "",
      remarks: "",
    },
  ]);
  const [formValues, setFormValues] = useState({
    drNumber: "",
    date: "",
    department: "",
    requisitionType: "",
    headerRemarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const formData = {
      ...formValues,
      rows,
    };
    const validationErrors = validateForm(formData, requisitionValidationRules);
    setErrors(validationErrors);
    setIsFormValid(Object.keys(validationErrors).length === 0);
  }, [formValues, rows]);

  useEffect(() => {
    if (isSubmitted) {
      const formData = {
        ...formValues,
        rows,
      };
      const validationErrors = validateForm(
        formData,
        requisitionValidationRules
      );
      setErrors(validationErrors);
      setIsFormValid(Object.keys(validationErrors).length === 0);
    }
  }, [formValues, rows, isSubmitted]);

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRowInputChange = (index, name, value) => {
    const values = [...rows];
    values[index][name] = value;
    setRows(values);
  };

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

  const handleSubmit = () => {
    setSubmitError(""); // Clear previous errors
    handleFormSubmit({
      formValues,
      rows,
      validationRules: requisitionValidationRules,
      apiEndpoint: `${ServerUrl}/requisition/createRequisition`,
      setErrors,
      setIsFormValid,
      setLoading,
      setSuccessModalVisible,
      setErrorModalVisible,
      setErrorMessages,
      setIsSubmitted,
    }).catch((error) => {
      setSubmitError(errorMessages.join("\n"));
    });
  };

  return (
    <View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <FormFields
          fields={requisitionFields}
          values={formValues}
          onChange={handleInputChange}
          errors={isSubmitted ? errors : {}}
        />
        <FormRows
          rows={rows}
          rowFields={rowFields}
          handleRowInputChange={handleRowInputChange}
          removeRow={removeRow}
          errors={errors}
          isSubmitted={isSubmitted}
        />
        <View style={styles.buttonContainer}>
          <Button title="Add Row" onPress={addRow} color="#1b1f26" />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              (!isFormValid || loading) && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {submitError ? submitError : "Submit"}
              </Text>
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

      <ReusableModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        headerText="Success"
        bodyText="Requisition created successfully."
        buttonText="OK"
        onButtonPress={() => {
          setSuccessModalVisible(false);
          navigation.navigate("RequisitionData");
        }}
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
    marginBottom: 20,
  },
});

export default RequisitionGeneral;
