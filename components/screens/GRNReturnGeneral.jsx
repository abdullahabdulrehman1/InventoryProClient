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

const GRNReturnGeneral = () => {
  const [grnrNumber, setGrnrNumber] = useState("");
  const [grnrDate, setGrnrDate] = useState("");
  const [grnNumber, setGrnNumber] = useState("");
  const [grnDate, setGrnDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [tableData, setTableData] = useState([
    {
      id: 1,
      category: "Category 1",
      name: "Item 1",
      unit: "pcs",
      grnQty: 100,
      previousReturnQty: 50,
      balanceGrnQty: 50,
      returnQty: 50,
      remarks: "Remark 1",
    },
    {
      id: 2,
      category: "Category 2",
      name: "Item 2",
      unit: "kg",
      grnQty: 200,
      previousReturnQty: 100,
      balanceGrnQty: 100,
      returnQty: 100,
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
    if (!grnrNumber) {
      ToastAndroid.show("Please enter GRNR #", ToastAndroid.SHORT);
      return;
    }
    if (!validateDate(grnrDate)) {
      ToastAndroid.show(
        "Invalid date format. Use DD-MM-YYYY",
        ToastAndroid.SHORT
      );
      return;
    }
    if (!grnNumber) {
      ToastAndroid.show("Please enter GRN #", ToastAndroid.SHORT);
      return;
    }
    if (!validateDate(grnDate)) {
      ToastAndroid.show(
        "Invalid GRN Date format. Use DD-MM-YYYY",
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
      <Text style={styles.tableHeader}>Level 3 Item Category</Text>
      <Text style={styles.tableHeader}>Item Name</Text>
      <Text style={styles.tableHeader}>Unit</Text>
      <Text style={styles.tableHeader}>GRN Qty</Text>
      <Text style={styles.tableHeader}>Previous Return Qty</Text>
      <Text style={styles.tableHeader}>Balance GRN Qty</Text>
      <Text style={styles.tableHeader}>Return Qty</Text>
      <Text style={styles.tableHeader}>Remarks</Text>
    </View>
  );

  const renderTableRow = ({ item, index }) => (
    <View style={styles.tableRow} key={item.id}>
      <Text style={styles.tableCell}>Edit/Delete</Text>
      <Text style={styles.tableCell}>{index + 1}</Text>
      <Text style={styles.tableCell}>{item.category}</Text>
      <Text style={styles.tableCell}>{item.name}</Text>
      <Text style={styles.tableCell}>{item.unit}</Text>
      <Text style={styles.tableCell}>{item.grnQty}</Text>
      <Text style={styles.tableCell}>{item.previousReturnQty}</Text>
      <Text style={styles.tableCell}>{item.balanceGrnQty}</Text>
      <Text style={styles.tableCell}>{item.returnQty}</Text>
      <Text style={styles.tableCell}>{item.remarks}</Text>
    </View>
  );

  const formData = [
    {
      key: "grnrNumber",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>GRNR #</Text>
          </View>
          <TextInput
            style={styles.input}
            value={grnrNumber}
            onChangeText={setGrnrNumber}
            placeholder="Enter GRNR #"
            placeholderTextColor="#888"
          />
        </View>
      ),
    },
    {
      key: "grnrDate",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>GRNR Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={grnrDate}
            onChangeText={setGrnrDate}
            placeholder="Enter GRNR Date (DD-MM-YYYY)"
            placeholderTextColor="#888"
          />
        </View>
      ),
    },
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
      key: "grnDate",
      render: () => (
        <View style={styles.fieldContainer}>
          <View style={styles.iconLabelContainer}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.label}>GRN Date</Text>
          </View>
          <TextInput
            style={styles.input}
            value={grnDate}
            onChangeText={setGrnDate}
            placeholder="Enter GRN Date (DD-MM-YYYY)"
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
          <Text style={styles.buttonText}>Show GRN Return Data</Text>
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
                <Text style={styles.modalHeader}>GRN Return Data</Text>
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

export default GRNReturnGeneral;

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
