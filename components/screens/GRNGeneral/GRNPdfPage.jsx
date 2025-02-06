import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
    Alert,
    Platform,
    StatusBar,
    StyleSheet
} from "react-native";
import { useGeneratePdfReportMutation } from "../../redux/api/grnApi";
import PdfPageUtil from "../../utils/pdfFormutil";

const GRNPdfPage = ({ navigation }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("asc");
    const [selectedColumns, setSelectedColumns] = useState([
        "grnNumber",
        "date",
        "supplierChallanNumber",
        "supplierChallanDate",
        "supplier",
        "inwardNumber",
        "inwardDate",
        "remarks",
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
                fromDate: startDate.toISOString().split("T")[0],
                toDate: endDate.toISOString().split("T")[0],
                sortBy,
                order,
                selectedColumns,
            }).unwrap();

            console.log("PDF Report Response:", response);

            if (response && response.reportUrl) {
                const fileUri = `${FileSystem.documentDirectory}${response.reportUrl.split("/").pop()}`;
                const downloadResumable = FileSystem.createDownloadResumable(
                    response.reportUrl,
                    fileUri
                );
                const { uri } = await downloadResumable.downloadAsync();

                Alert.alert("Success", "PDF report generated successfully");
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(uri);
                } else {
                    Alert.alert("Error", "Sharing is not available on this device");
                }
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
                { label: "GRN Number", value: "grnNumber" },
                { label: "Date", value: "date" },
                { label: "Supplier Challan Number", value: "supplierChallanNumber" },
                { label: "Supplier Challan Date", value: "supplierChallanDate" },
                { label: "Supplier", value: "supplier" },
                { label: "Inward Number", value: "inwardNumber" },
                { label: "Inward Date", value: "inwardDate" },
                { label: "Remarks", value: "remarks" },
            ]}
            sortOptions={[
                { label: "Date", value: "date" },
                { label: "Supplier", value: "supplier" },
                { label: "Inward Number", value: "inwardNumber" },
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

export default GRNPdfPage;