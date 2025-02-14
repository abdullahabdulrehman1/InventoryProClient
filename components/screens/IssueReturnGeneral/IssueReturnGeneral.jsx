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

const IssueReturnGeneral = ({ navigation }) => {
  const [formValues, setFormValues] = useState({
    irNumber: "",
    irDate: "",
    drNumber: "",
    drDate: "",
    remarks: "",
  });
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
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formFields = [
    { name: "irNumber", label: "IR #", icon: "document-text-outline", type: "text" },
    { name: "irDate", label: "IR Date", icon: "calendar-outline", type: "date", placeholder: "dd-mm-yyyy" },
    { name: "drNumber", label: "DR #", icon: "document-text-outline", type: "text" },
    { name: "drDate", label: "DR Date", icon: "calendar-outline", type: "date", placeholder: "dd-mm-yyyy" },
    { name: "remarks", label: "Remarks", icon: "chatbox-ellipses-outline", type: "text" },
  ];

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRowInputChange = (index, name, value) => {
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

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
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
    } else {
      Alert.alert("Error", "At least one row is required.");
    }
  };

  const validateDate = (date) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(date);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!validateDate(formValues.irDate) || !validateDate(formValues.drDate)) {
      Alert.alert("Error", "Please enter dates in the format dd-mm-yyyy.");
      return;
    }

    const validationRules = [
      {
        field: "irNumber",
        validations: [{ method: validationMethods.required, message: "IR Number is required" }],
      },
      {
        field: "irDate",
        validations: [{ method: validationMethods.required, message: "IR Date is required" }, { method: validationMethods.validateDate, message: "IR Date must be in dd-mm-yyyy format" }],
      },
      {
        field: "drNumber",
        validations: [{ method: validationMethods.required, message: "DR Number is required" }],
      },
      {
        field: "drDate",
        validations: [{ method: validationMethods.required, message: "DR Date is required" }, { method: validationMethods.validateDate, message: "DR Date must be in dd-mm-yyyy format" }],
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
          level3ItemCategory: [{ method: validationMethods.required, message: "Level 3 Item Category is required" }],
          itemName: [{ method: validationMethods.required, message: "Item Name is required" }],
          unit: [{ method: validationMethods.required, message: "Unit is required" }],
          issueQty: [{ method: validationMethods.required, message: "Issue Qty is required" }, { method: validationMethods.isNumber, message: "Issue Qty must be a number" }],
          previousReturnQty: [{ method: validationMethods.required, message: "Previous Return Qty is required" }, { method: validationMethods.isNumber, message: "Previous Return Qty must be a number" }],
          balanceIssueQty: [{ method: validationMethods.required, message: "Balance Issue Qty is required" }, { method: validationMethods.isNumber, message: "Balance Issue Qty must be a number" }],
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
      const token = await SecureStore.getItemAsync("token");
      const user = await SecureStore.getItemAsync("user");
      const userId = JSON.parse(user)._id;
      const [irDay, irMonth, irYear] = formValues.irDate.split("-");
      const isoIrDate = new Date(`${irYear}-${irMonth}-${irDay}`).toISOString();
      const [drDay, drMonth, drYear] = formValues.drDate.split("-");
      const isoDrDate = new Date(`${drYear}-${drMonth}-${drDay}`).toISOString();

      try {
        const response = await axios.post(`${ServerUrl}/issueReturnGeneral/create-issue-return-general`, {
          userId,
          irNumber: formValues.irNumber,
          irDate: isoIrDate,
          drNumber: formValues.drNumber,
          drDate: isoDrDate,
          remarks: formValues.remarks,
          rows,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 201) {
          setSuccessModalVisible(true);
        } else {
          Alert.alert("Error", response.data.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("Error response:", error.response);
        if (error.response) {
          setErrorMessage(error.response.data.message || "Something went wrong.");
        } else if (error.request) {
          setErrorMessage("No response received from server.");
        } else {
          setErrorMessage(error.message || "Something went wrong.");
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
    navigation.navigate("IssueReturnTabs",{
      screen: "ReturnData",
      
        params: {
          shouldRefresh: true // Optional: Add any refresh flags if needed
        
      }
    });
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
          { name: "serialNo", label: "S.No", placeholder: "S.No" },
          { name: "level3ItemCategory", label: "Level 3 Item Category", placeholder: "Level 3 Item Category" },
          { name: "itemName", label: "Item Name", placeholder: "Item Name" },
          { name: "unit", label: "Unit", placeholder: "Unit" },
          { name: "issueQty", label: "Issue Qty", placeholder: "Issue Qty", type: "number" },
          { name: "previousReturnQty", label: "Previous Return Qty", placeholder: "Previous Return Qty", type: "number" },
          { name: "balanceIssueQty", label: "Balance Issue Qty", placeholder: "Balance Issue Qty", type: "number" },
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

      <ReusableModal
        visible={successModalVisible}
        onClose={handleSuccessModalClose}
        headerText="Success"
        bodyText="Issue Return created successfully."
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

export default IssueReturnGeneral;