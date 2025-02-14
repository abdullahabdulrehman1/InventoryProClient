import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import FormFields from "../../common/FormFields";
import FormRows from "../../common/FormRows";
import ServerUrl from "../../config/ServerUrl";
import { validateForm, validationMethods } from "../../utils/formValidation";
import ReusableButton from "../../utils/reusableButton";
import ReusableModal from "../../utils/ReusableModal";

const IssueGeneral = ({ navigation }) => {
  const [rows, setRows] = useState([
    {
      action: "",
      serialNo: "",
      level3ItemCategory: "",
      itemName: "",
      uom: "",
      grnQty: "",
      previousIssueQty: "",
      balanceQty: "",
      issueQty: "",
      rowRemarks: "",
    },
  ]);
  const [grnNumber, setGrnNumber] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [store, setStore] = useState("");
  const [requisitionType, setRequisitionType] = useState("On Requisition");
  const [issueToUnit, setIssueToUnit] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [issueToDepartment, setIssueToDepartment] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [driver, setDriver] = useState("");
  const [remarks, setRemarks] = useState("");
  const [demandNo, setDemandNo] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formFields = [
    { name: "grnNumber", label: "GRN Number", icon: "document-text-outline", type: "text" },
    { name: "issueNumber", label: "Issue Number", icon: "document-text-outline", type: "text" },
    { name: "issueDate", label: "Issue Date", icon: "calendar-outline", type: "date", placeholder: "dd-mm-yyyy" },
    { name: "store", label: "Store", icon: "business-outline", type: "text" },
    { name: "requisitionType", label: "Requisition Type", icon: "list-outline", type: "picker", options: [
      { label: "On Requisition", value: "On Requisition" },
      { label: "Direct Issue", value: "Direct Issue" },
    ]},
    { name: "issueToUnit", label: "Issue To Unit", icon: "business-outline", type: "text" },
    { name: "vehicleType", label: "Vehicle Type", icon: "car-outline", type: "text" },
    { name: "issueToDepartment", label: "Issue To Department", icon: "business-outline", type: "text" },
    { name: "vehicleNo", label: "Vehicle No", icon: "car-outline", type: "text" },
    { name: "driver", label: "Driver", icon: "person-outline", type: "text" },
    { name: "remarks", label: "Remarks", icon: "chatbox-ellipses-outline", type: "text" },
    { name: "demandNo", label: "Demand No", icon: "document-text-outline", type: "text" },
  ];

  const handleInputChange = (name, value) => {
    switch (name) {
      case "grnNumber":
        setGrnNumber(value);
        break;
      case "issueNumber":
        setIssueNumber(value);
        break;
      case "issueDate":
        setIssueDate(value);
        break;
      case "store":
        setStore(value);
        break;
      case "requisitionType":
        setRequisitionType(value);
        break;
      case "issueToUnit":
        setIssueToUnit(value);
        break;
      case "vehicleType":
        setVehicleType(value);
        break;
      case "issueToDepartment":
        setIssueToDepartment(value);
        break;
      case "vehicleNo":
        setVehicleNo(value);
        break;
      case "driver":
        setDriver(value);
        break;
      case "remarks":
        setRemarks(value);
        break;
      case "demandNo":
        setDemandNo(value);
        break;
      default:
        break;
    }
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
        uom: "",
        grnQty: "",
        previousIssueQty: "",
        balanceQty: "",
        issueQty: "",
        rowRemarks: "",
      },
    ]);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const validationRules = [
     
      {
        field: "issueDate",
        validations: [{ method: validationMethods.required, message: "Issue Date is required" }, { method: validationMethods.validateDate, message: "Issue Date must be in dd-mm-yyyy format" }],
      },
      {
        field: "issueNumber",
        validations: [{ method: validationMethods.required, message: "Issue Number is required" }, 
        ]
      },
      {
        field: "store",
        validations: [{ method: validationMethods.required, message: "Store is required" }],
      },
      {
        field: "requisitionType",
        validations: [{ method: validationMethods.required, message: "Requisition Type is required" }],
      },
      {
        field: "issueToUnit",
        validations: [{ method: validationMethods.required, message: "Issue To Unit is required" }],
      },
      {
        field: "vehicleType",
        validations: [{ method: validationMethods.required, message: "Vehicle Type is required" }],
      },
      {
        field: "issueToDepartment",
        validations: [{ method: validationMethods.required, message: "Issue To Department is required" }],
      },
      {
        field: "vehicleNo",
        validations: [{ method: validationMethods.required, message: "Vehicle No is required" }],
      },
      {
        field: "driver",
        validations: [{ method: validationMethods.required, message: "Driver is required" }],
      },
      {
        field: "remarks",
        validations: [{ method: validationMethods.required, message: "Remarks are required" }],
      },
      {
        field: "demandNo",
        validations: [{ method: validationMethods.required, message: "Demand No is required" }],
      },
      {
        field: "rows",
        validations: {
          action: [{ method: validationMethods.required, message: "Action is required" }],
          serialNo: [{ method: validationMethods.required, message: "Serial No is required" }],
          level3ItemCategory: [{ method: validationMethods.required, message: "Item Category is required" }],
          itemName: [{ method: validationMethods.required, message: "Item Name is required" }],
          uom: [{ method: validationMethods.required, message: "UOM is required" }],
          grnQty: [{ method: validationMethods.required, message: "GRN Qty is required" }, { method: validationMethods.isNumber, message: "GRN Qty must be a number" }],
          previousIssueQty: [{ method: validationMethods.required, message: "Previous Issue Qty is required" }, { method: validationMethods.isNumber, message: "Previous Issue Qty must be a number" }],
          balanceQty: [{ method: validationMethods.required, message: "Balance Qty is required" }, { method: validationMethods.isNumber, message: "Balance Qty must be a number" }],
          issueQty: [{ method: validationMethods.required, message: "Issue Qty is required" }, { method: validationMethods.isNumber, message: "Issue Qty must be a number" }],
          rowRemarks: [{ method: validationMethods.maxLength, args: [150], message: "Row Remarks must be less than 150 characters" }],
        },
      },
    ];

    const formData = {
      grnNumber,
      issueDate,
      issueNumber,
      store,
      requisitionType,
      issueToUnit,
      vehicleType,
      issueToDepartment,
      vehicleNo,
      driver,
      remarks,
      demandNo,
      rows,
    };
    const validationErrors = validateForm(formData, validationRules);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Simulate form submission
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync("token");
        const user = await SecureStore.getItemAsync("user");
        const userId = JSON.parse(user)._id;
        console.log("User ID:", userId); // Debugging log
        const isoDate = new Date(issueDate.split("-").reverse().join("-")).toISOString();
        const response = await axios.post(
          `${ServerUrl}/issueGeneral/create-issue-general`,
          {
            token,
            userId,
            grnNumber,
            issueNumber,
            issueDate: isoDate,
            store,
            requisitionType,
            issueToUnit,
            demandNo,
            vehicleType,
            issueToDepartment,
            vehicleNo,
            driver,
            remarks,
            rows,
          },  {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        if (response.status === 201) {
          setSuccessModalVisible(true);
        } else {
          Alert.alert("Error", response.data.message || "Something went wrong.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "An error occurred while creating the issue.");
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
    navigation.navigate("IssueGeneralData");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FormFields
        fields={formFields}
        values={{
          grnNumber,
          issueDate,
          store,
          requisitionType,
          issueToUnit,
          vehicleType,
          issueNumber,
          issueToDepartment,
          vehicleNo,
          driver,
          remarks,
          demandNo,
        }}
        onChange={handleInputChange}
        errors={errors}
      />
      <FormRows
        rows={rows}
        rowFields={[
          { name: "action", label: "Action", placeholder: "Action" },
          { name: "serialNo", label: "Serial No", placeholder: "Serial No" },
          { name: "level3ItemCategory", label: "Item Category", placeholder: "Item Category" },
          { name: "itemName", label: "Item Name", placeholder: "Item Name" },
          { name: "uom", label: "UOM", placeholder: "UOM" },
          { name: "grnQty", label: "GRN Qty", placeholder: "GRN Qty", type: "number" },
          { name: "previousIssueQty", label: "Previous Issue Qty", placeholder: "Previous Issue Qty", type: "number" },
          { name: "balanceQty", label: "Balance Qty", placeholder: "Balance Qty", type: "number" },
          { name: "issueQty", label: "Issue Qty", placeholder: "Issue Qty", type: "number" },
          { name: "rowRemarks", label: "Row Remarks", placeholder: "Row Remarks" },
        ]}
        handleRowInputChange={handleRowInputChange}
        removeRow={removeRow}
        errors={errors}
        isSubmitted={isSubmitted}
      />
      <ReusableButton onPress={addRow} text="Add Row" />
      <ReusableButton onPress={handleSubmit} loading={loading} text="Submit" />
      <ReusableButton onPress={() => navigation.navigate("IssueGeneralData")} text="Show Issue General Data" />
      <ReusableButton
      onPress={() => navigation.navigate('IssueGeneralPDF')}
      text="Generate PDF Report"
    />
      <ReusableModal
        visible={successModalVisible}
        onClose={handleSuccessModalClose}
        headerText="Success"
        bodyText="Issue General created successfully."
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

export default IssueGeneral;