import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import FormFields from "../../common/FormFields";
import FormRows from "../../common/FormRows";
import ServerUrl from "../../config/ServerUrl";
import { validateForm, validationMethods } from "../../utils/formValidation";
import HeaderBackArrow from "../../utils/headerBackArrow";
import ReusableButton from "../../utils/reusableButton";
import ReusableModal from "../../utils/ReusableModal";

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
    issueReturn.rows.map((row) => ({
      action: row.action || "",
      serialNo: row.serialNo || "",
      level3ItemCategory: row.level3ItemCategory || "",
      itemName: row.itemName || "",
      unit: row.unit || "",
      issueQty: row.issueQty || "",
      previousReturnQty: row.previousReturnQty || "",
      balanceIssueQty: row.balanceIssueQty || "",
      returnQty: row.returnQty || "",
      rowRemarks: row.rowRemarks || "",
    })) || []
  );
  const [formValues, setFormValues] = useState({
    irNumber: issueReturn.irNumber || "",
    irDate: issueReturn.irDate ? formatDate(issueReturn.irDate) : "",
    drNumber: issueReturn.drNumber || "",
    drDate: issueReturn.drDate ? formatDate(issueReturn.drDate) : "",
    remarks: issueReturn.remarks || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formFields = [
    { name: "irNumber", label: "IR Number", icon: "document-text-outline", type: "text" },
    { name: "irDate", label: "IR Date", icon: "calendar-outline", type: "text", placeholder: "dd-mm-yyyy" },
    { name: "drNumber", label: "DR Number", icon: "document-text-outline", type: "text" },
    { name: "drDate", label: "DR Date", icon: "calendar-outline", type: "text", placeholder: "dd-mm-yyyy" },
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

  const removeRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
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

  const handleSubmit = async () => {
    setIsSubmitted(true);
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
      try {
        const token = await SecureStore.getItemAsync("token");
        const user = await SecureStore.getItemAsync("user");
        const userId = JSON.parse(user)._id;
        const isoIrDate = new Date(formValues.irDate.split("-").reverse().join("-")).toISOString();
        const isoDrDate = new Date(formValues.drDate.split("-").reverse().join("-")).toISOString();
        const response = await axios.put(
          `${ServerUrl}/issueReturnGeneral/edit-issue-return-general`,
          {
            userId,
            id: issueReturn._id,
            ...formValues,
            irDate: isoIrDate,
            drDate: isoDrDate,
            rows,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
        routes: [{ name: "IssueReturnGeneralData" }],
      })
    );
  };

  return (
    <View style={styles.container}>
    <HeaderBackArrow navigation={navigation} title="Edit Issue Return General" targetScreen="IssueReturnGeneralData" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        <ReusableButton onPress={() => navigation.navigate("IssueReturnGeneralData")} text="Show Issue Return General Data" />
        <ReusableModal
          visible={successModalVisible}
          onClose={handleSuccessModalClose}
          headerText="Success"
          bodyText="Issue Return General updated successfully."
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollContainer: {
    padding: 20,
  },
});

export default IssueReturnGeneralEdit;