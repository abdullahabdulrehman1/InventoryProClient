import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import ServerUrl from "../../config/ServerUrl";
import * as SecureStore from "expo-secure-store";
import ReusableModal from "../../utils/ReusableModal";
import ReusableButton from "../../utils/reusableButton";
import FormRows from "../../common/FormRows";
const GRNGeneral = ({ navigation }) => {
  const [grnNumber, setGrnNumber] = useState("");
  const [date, setDate] = useState("");
  const [supplierChallanNumber, setSupplierChallanNumber] = useState("");
  const [supplierChallanDate, setSupplierChallanDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [inwardNumber, setInwardNumber] = useState("");
  const [inwardDate, setInwardDate] = useState("");
  const [remarks, setRemarks] = useState("");
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
  const rowFields = [
    { name: "poNo", label: "PO Number", placeholder: "PO Number" },
    { name: "department", label: "Department", placeholder: "Department" },
    { name: "category", label: "Category", placeholder: "Category" },
    { name: "name", label: "Item Name", placeholder: "Item Name" },
    { name: "unit", label: "Unit", placeholder: "Unit" },
    { name: "poQty", label: "PO Quantity", placeholder: "PO Quantity", type: "number" },
    { name: "previousQty", label: "Previous Quantity", placeholder: "Previous Quantity", type: "number" },
    { name: "balancePoQty", label: "Balance PO Quantity", placeholder: "Balance PO Quantity", type: "number" },
    { name: "receivedQty", label: "Received Quantity", placeholder: "Received Quantity", type: "number" },
    { name: "rowRemarks", label: "Row Remarks", placeholder: "Row Remarks" },
  ];
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
    const values = [...rows];
    values[index][name] = value;
    setRows(values);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = await SecureStore.getItemAsync("token");
    const user = await SecureStore.getItemAsync("user");
    const userId = JSON.parse(user)._id;

    try {
      const response = await axios.post(`${ServerUrl}/grnGeneral/createGRN`, {
        token,
        userId,
        grnNumber,
        date,
        supplierChallanNumber,
        supplierChallanDate,
        supplier,
        inwardNumber,
        inwardDate,
        remarks,
        rows,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        setSuccessModalVisible(true);
      } else {
        setErrorMessages(response.data.errors.map((error) => error.msg));
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      if (error.response) {
        setErrorMessages(error.response.data.errors.map((error) => error.msg));
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

  return (
    <View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>GRN Number</Text>
          </View>
          <TextInput
            style={styles.input}
            value={grnNumber}
            onChangeText={setGrnNumber}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="dd-mm-yyyy"
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>Supplier Challan Number</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplierChallanNumber}
            onChangeText={setSupplierChallanNumber}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>Supplier Challan Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplierChallanDate}
            onChangeText={setSupplierChallanDate}
            placeholder="dd-mm-yyyy"
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="business-outline" size={20} color="black" />
            <Text style={styles.label}>Supplier</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplier}
            onChangeText={setSupplier}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="document-text-outline" size={20} color="black" />
            <Text style={styles.label}>Inward Number</Text>
          </View>
          <TextInput
            style={styles.input}
            value={inwardNumber}
            onChangeText={setInwardNumber}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.label}>Inward Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={inwardDate}
            onChangeText={setInwardDate}
            placeholder="dd-mm-yyyy"
            required
          />
        </View>
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={20} color="black" />
            <Text style={styles.label}>Remarks</Text>
          </View>
          <TextInput
            style={styles.input}
            value={remarks}
            onChangeText={setRemarks}
          />
        </View>
        <FormRows
        rows={rows}
        rowFields={rowFields}
        handleRowInputChange={handleInputChange}
        removeRow={removeRow}
        errors={{}}
        isSubmitted={false}
      />
        <View style={styles.buttonContainer}>
          <Button title="Add Row" onPress={addRow} color="#1b1f26" />
        </View>
        <ReusableButton
          onPress={handleSubmit}
          loading={loading}
          text="Submit"
        />
        <ReusableButton
          onPress={() => navigation.navigate("GRNGeneralData")}
          text="Show GRN General Data"
        />
        <ReusableButton
          onPress={() => navigation.navigate('GRNPdfPage')}
          text="Generate PDF Report"
        />
       
      </ScrollView>

    
      <ReusableModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        headerText="Success"
        bodyText="GRN created successfully."
        buttonText="OK"
        onButtonPress={() => {
          setSuccessModalVisible(false);
          navigation.navigate("GRNGeneralData");
        }}
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
  row: {
    marginBottom: 15,
    position: "relative",
  },
  rowLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  rowInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 20,
    marginBottom: 5,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  button: {
    backgroundColor: "#1b1f26",
    padding: 15,
    width: "100%",
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default GRNGeneral;
