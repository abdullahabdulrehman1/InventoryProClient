import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GRNGeneral = () => {
  const [grnNumber, setGrnNumber] = useState("");
  const [date, setDate] = useState("");
  const [supplierChallanNumber, setSupplierChallanNumber] = useState("");
  const [supplierChallanDate, setSupplierChallanDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [inwardNumber, setInwardNumber] = useState("");
  const [inwardDate, setInwardDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [tableData, setTableData] = useState([
    {
      id: 1,
      poNo: "PO001",
      department: "Department 1",
      category: "Category 1",
      name: "Item 1",
      unit: "pcs",
      poQty: 100,
      previousQty: 50,
      balancePoQty: 50,
      receivedQty: 50,
      remarks: "Remark 1",
    },
    {
      id: 2,
      poNo: "PO002",
      department: "Department 2",
      category: "Category 2",
      name: "Item 2",
      unit: "kg",
      poQty: 200,
      previousQty: 100,
      balancePoQty: 100,
      receivedQty: 100,
      remarks: "Remark 2",
    },
    // Add more items as needed
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const validateDate = (date) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(date);
  };

  const handleSubmit = () => {
    if (!grnNumber) {
      ToastAndroid.show("Please enter GRN #", ToastAndroid.SHORT);
      return;
    }
    if (!validateDate(date)) {
      ToastAndroid.show(
        "Invalid date format. Use DD-MM-YYYY",
        ToastAndroid.SHORT
      );
      return;
    }
    if (!supplierChallanNumber) {
      ToastAndroid.show("Please enter Supplier Challan #", ToastAndroid.SHORT);
      return;
    }
    if (!validateDate(supplierChallanDate)) {
      ToastAndroid.show(
        "Invalid Supplier Challan Date format. Use DD-MM-YYYY",
        ToastAndroid.SHORT
      );
      return;
    }
    if (!supplier) {
      ToastAndroid.show("Please enter Supplier", ToastAndroid.SHORT);
      return;
    }
    if (!inwardNumber) {
      ToastAndroid.show("Please enter Inward #", ToastAndroid.SHORT);
      return;
    }
    if (!validateDate(inwardDate)) {
      ToastAndroid.show(
        "Invalid Inward Date format. Use DD-MM-YYYY",
        ToastAndroid.SHORT
      );
      return;
    }
    if (!remarks) {
      ToastAndroid.show("Please enter Remarks", ToastAndroid.SHORT);
      return;
    }

    // Submit the form
    ToastAndroid.show("Form submitted successfully", ToastAndroid.SHORT);
  };

  const renderTableHeader = () => (
    <View style={styles.tableRow}>
      <Text style={styles.tableHeader}>Action</Text>
      <Text style={styles.tableHeader}>S.No</Text>
      <Text style={styles.tableHeader}>PO No</Text>
      <Text style={styles.tableHeader}>Department</Text>
      <Text style={styles.tableHeader}>Level 3 Item Category</Text>
      <Text style={styles.tableHeader}>Item Name</Text>
      <Text style={styles.tableHeader}>Unit</Text>
      <Text style={styles.tableHeader}>PO Qty</Text>
      <Text style={styles.tableHeader}>Previous Qty</Text>
      <Text style={styles.tableHeader}>Balance PO Qty</Text>
      <Text style={styles.tableHeader}>Received Qty</Text>
      <Text style={styles.tableHeader}>Remarks</Text>
    </View>
  );

  const renderTableRow = ({ item, index }) => (
    <View style={styles.tableRow} key={item.id}>
      <Text style={styles.tableCell}>Edit/Delete</Text>
      <Text style={styles.tableCell}>{index + 1}</Text>
      <Text style={styles.tableCell}>{item.poNo}</Text>
      <Text style={styles.tableCell}>{item.department}</Text>
      <Text style={styles.tableCell}>{item.category}</Text>
      <Text style={styles.tableCell}>{item.name}</Text>
      <Text style={styles.tableCell}>{item.unit}</Text>
      <Text style={styles.tableCell}>{item.poQty}</Text>
      <Text style={styles.tableCell}>{item.previousQty}</Text>
      <Text style={styles.tableCell}>{item.balancePoQty}</Text>
      <Text style={styles.tableCell}>{item.receivedQty}</Text>
      <Text style={styles.tableCell}>{item.remarks}</Text>
    </View>
  );

  const formData = [
    
    {
      key: "grnNumber",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>GRN #</Text>
          </View>
          <TextInput
            style={styles.input}
            value={grnNumber}
            onChangeText={setGrnNumber}
            placeholder="Enter GRN #"
            placeholderTextColor="#888"
          />
        </View>
      ),
    },
    {
      key: "date",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="Enter Date (DD-MM-YYYY)"
            placeholderTextColor="#888"
          />
        </View>
      ),
    },
    {
      key: "supplierChallanNumber",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>Supplier Challan #</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplierChallanNumber}
            onChangeText={setSupplierChallanNumber}
            placeholder="Enter Supplier Challan #"
            placeholderTextColor="#888"
          />
        </View>
      ),
    },
    {
      key: "supplierChallanDate",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>Supplier Challan Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplierChallanDate}
            onChangeText={setSupplierChallanDate}
            placeholder="(DD-MM-YYYY)"
            placeholderTextColor="#888"
          />
        </View>
      ),
    },
    { 
      key: "supplier",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="business-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>Supplier</Text>
          </View>
          <TextInput
            style={styles.input}
            value={supplier}
            onChangeText={setSupplier}
            placeholder="Enter Supplier"
            placeholderTextColor="#888"
          />
        </View>
      ),
    },
    {
      key: "inwardNumber",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>Inward #</Text>
          </View>
          <TextInput
            style={styles.input}
            value={inwardNumber}
            onChangeText={setInwardNumber}
            placeholder="Enter Inward #"
            placeholderTextColor="#888"
          />
        </View>
      ),
    },
    {
      key: "inwardDate",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>Inward Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={inwardDate}
            onChangeText={setInwardDate}
            placeholder="Enter Inward Date (DD-MM-YYYY)"
            placeholderTextColor="#888"
          />
        </View>
      ),
    },
    {
      key: "remarks",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="chatbox-ellipses-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>Remarks</Text>
          </View>
          <TextInput
            style={styles.input}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter Remarks"
            placeholderTextColor="#888"
          />
        </View>
      ),
    },
    {
      key: "submit",
      render: () => (
        <View style={{ borderRadius: 20, overflow: "hidden" }}>
          <Button title="Submit" onPress={handleSubmit} color="#1b1f26" />
        </View>
      ),
    },
    {
      key: "showTableButton",
      render: () => (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.buttonText}>Show GRN Data</Text>
        </TouchableOpacity>
      ),
    },
  ];

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const paginatedData = tableData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // Adjust this value based on your header height
    >
      <ScrollView>
        {formData.map((item) => (
          <View key={item.key}>{item.render()}</View>
        ))}
      </ScrollView>
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <ScrollView horizontal={true}>
              <ScrollView>
                <Text style={styles.modalHeader}>GRN Data</Text>
                {renderTableHeader()}
                {paginatedData.map((item, index) =>
                  renderTableRow({ item, index })
                )}
                <View style={styles.paginationContainer}>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.pageButton,
                        currentPage === index && styles.activePageButton,
                      ]}
                      onPress={() => setCurrentPage(index)}
                    >
                      <Text style={styles.pageButtonText}>{index + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default GRNGeneral;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldContainer: {
    marginBottom: 10,
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    color: "#333",
  },
  pickerContainer: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  button: {
    backgroundColor: "#1b1f26",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tableContainer: {
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  tableHeader: {
    flex: 1,
    fontWeight: "bold",
    color: "#333",
  },
  tableCell: {
    flex: 1,
    color: "#333",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  pageButton: {
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  activePageButton: {
    backgroundColor: "#1b1f26",
  },
  pageButtonText: {
    color: "#fff",
  },
});