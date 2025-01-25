import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import { useGeneratePdfReportMutation } from "../../redux/api/api"; // Adjust the path to your API slice
import PdfPageUtil from "../../utils/pdfFormutil"; // Adjust the path to your util file       
const PdfPage = ({ navigation }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("asc");
  const [selectedColumns, setSelectedColumns] = useState([
    "drNumber",
    "date",
    "itemName",
    "quantity",
    "amount",
  ]);

  const [generatePdfReport] = useGeneratePdfReportMutation();

  const availableColumns = [
    { label: "DR Number", value: "drNumber" },
    { label: "Date", value: "date" },
    { label: "Department", value: "department" },
    { label: "Requisition Type", value: "requisitionType" },
    { label: "Item Name", value: "itemName" },
    { label: "Quantity", value: "quantity" },
    { label: "Rate", value: "rate" },
    { label: "Amount", value: "amount" },
  ];

  const toggleColumn = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  const fetchAndDownloadPdf = async () => {
    if (!startDate || !endDate) {
      Alert.alert("Error", "Please select both start and end dates.");
      return;
    }

    // Show an alert to notify the user that the request is being processed
    Alert.alert(
      "Please Wait",
      "Your request is being processed. This may take a few moments."
    );

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await generatePdfReport({
        token,
        fromDate: startDate.toISOString().split("T")[0],
        toDate: endDate.toISOString().split("T")[0],
        sortBy,
        order,
        selectedColumns,
      }).unwrap();

      if (response.url) {
        const fileUri = `${FileSystem.documentDirectory}${response.url
          .split("/")
          .pop()}`;
        const downloadResumable = FileSystem.createDownloadResumable(
          response.url,
          fileUri
        );
        const { uri } = await downloadResumable.downloadAsync();

        Alert.alert("Success", "PDF report generated successfully");
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
      Alert.alert(
        "Error",
        error?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return (
    

    
    // Usage:
    <PdfPageUtil
      navigation={navigation}
      initialSelectedColumns={["drNumber", "date", "itemName", "quantity", "amount"]}
      availableColumns={[
        { label: "DR Number", value: "drNumber" },
        { label: "Date", value: "date" },
        { label: "Department", value: "department" },
        { label: "Requisition Type", value: "requisitionType" },
        { label: "Item Name", value: "itemName" },
        { label: "Quantity", value: "quantity" },
        { label: "Rate", value: "rate" },
        { label: "Amount", value: "amount" },
      ]}
      sortOptions={[
        { label: "Date", value: "date" },
        { label: "Amount", value: "amount" },
        { label: "Department", value: "department" },
      ]}
      fetchPdf={fetchAndDownloadPdf}
    />);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  columnsContainer: {
    marginBottom: 20,
  },
  columnOption: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedColumn: {
    backgroundColor: "#d0f0d0",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1b1f26",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PdfPage;
