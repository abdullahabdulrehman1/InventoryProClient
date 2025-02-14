import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import FormFields from "../../common/FormFields";
import FormRows from "../../common/FormRows";
import ServerUrl from "../../config/ServerUrl";
import ReusableModal from "../../utils/ReusableModal";
import ReusableButton from "../../utils/reusableButton";

const GRNGeneral = ({ navigation }) => {
 

  const [formValues, setFormValues] = useState({
    grnNumber: "",
    date: "",
    supplierChallanNumber: "",
    supplierChallanDate: "",
    supplier: "",
    inwardNumber: "",
    inwardDate: "",
    remarks: "",
  });

  const [rows, setRows] = useState([
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
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const formFields = [
    { name: "grnNumber", label: "GRN Number", placeholder: "GRN Number", type: "text", icon: "document-text-outline" },
    { name: "date", label: "Date", placeholder: "dd-mm-yyyy", type: "date", icon: "calendar-outline" },
    { name: "supplierChallanNumber", label: "Supplier Challan Number", placeholder: "Supplier Challan Number", type: "text", icon: "document-text-outline" },
    { name: "supplierChallanDate", label: "Supplier Challan Date", placeholder: "dd-mm-yyyy", type: "date", icon: "calendar-outline" },
    { name: "supplier", label: "Supplier", placeholder: "Supplier", type: "text", icon: "business-outline" },
    { name: "inwardNumber", label: "Inward Number", placeholder: "Inward Number", type: "text", icon: "document-text-outline" },
    { name: "inwardDate", label: "Inward Date", placeholder: "dd-mm-yyyy", type: "date", icon: "calendar-outline" },
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
    try {
      const response = await axios.post(`${ServerUrl}/grnGeneral/createGRN`, {
        userId,
        grnNumber: formValues.grnNumber,
        date: formValues.date,
        supplierChallanNumber: formValues.supplierChallanNumber,
        supplierChallanDate: formValues.supplierChallanDate,
        supplier: formValues.supplier,
        inwardNumber: formValues.inwardNumber,
        inwardDate: formValues.inwardDate,
        remarks: formValues.remarks,
        rows: items,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
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
    navigation.navigate("GRNGeneralData");
  };

  return (
    <View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
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
        <ReusableButton onPress={handleSubmit} text="Submit" loading={loading} />
        <ReusableButton onPress={() => navigation.navigate("GRNGeneralData")} text="Show GRN General Data" />
        <ReusableButton onPress={() => navigation.navigate('GRNPdfPage')} text="Generate PDF Report" />
      </ScrollView>

      <ReusableModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        headerText="Success"
        bodyText="GRN created successfully."
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
  buttonContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
    width: "100%",
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
});

export default GRNGeneral;