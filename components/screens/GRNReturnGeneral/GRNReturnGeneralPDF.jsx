import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet
} from "react-native";
import PdfPageUtil from "../../utils/pdfFormutil";
import { useGeneratePdfReportMutation } from "../../redux/api/GRNReturnGeneralApi";

const GRNReturnGeneralPDF = ({ navigation }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortBy, setSortBy] = useState("grnrDate"); // Updated sort field
  const [order, setOrder] = useState("asc");
  const [selectedColumns, setSelectedColumns] = useState([
    "grnrNumber",
    "grnDate", // Updated field
    "grnNumber",
    "grnDate",
    "remarks",
    "name",
    "returnQty",
  ]);
  const [loading, setLoading] = useState(false);
  const [generatePdfReport] = useGeneratePdfReportMutation();

  const fetchAndDownloadPdf = async () => {
    if (!startDate || !endDate) {
      Alert.alert("Error", "Please select both start and end dates.");
      return;
    }

    Alert.alert("Please Wait", "Your request is being processed. This may take a few moments.");

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

      console.log("PDF Report Response:", response);

      if (response && response.url) {
        return response;
      } else {
        Alert.alert("Error", "Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
      Alert.alert("Error", error?.data?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PdfPageUtil
      navigation={navigation}
      initialSelectedColumns={selectedColumns}
      availableColumns={[
        { label: "GRNR Number", value: "grnrNumber" },
        { label: "GRN Date", value: "grnDate" }, // Updated field
        { label: "GRN Number", value: "grnNumber" },
        { label: "Remarks", value: "remarks" },
        { label: "Item Name", value: "name" },
        { label: "Return Quantity", value: "returnQty" },
      ]}
      sortOptions={[
        { label: "GRNR Date", value: "grnrDate" }, // Updated field
      ]}
      fetchPdf={fetchAndDownloadPdf}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onSortByChange={setSortBy}
      onOrderChange={setOrder}
      onSelectedColumnsChange={setSelectedColumns}
      loading={loading}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default GRNReturnGeneralPDF;