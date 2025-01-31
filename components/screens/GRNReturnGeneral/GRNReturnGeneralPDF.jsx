import React, { useState } from "react";
import {
    View,
    Alert,
    StyleSheet,
    Platform,
    StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import PdfPageUtil from "../../utils/pdfFormutil";
import { useGeneratePdfReportMutation } from "../../redux/api/GRNReturnGeneralApi";

const GRNReturnGeneralPDF = ({ navigation }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortBy, setSortBy] = useState("grnrDate");
    const [order, setOrder] = useState("asc");
    const [selectedColumns, setSelectedColumns] = useState([
        "grnrNumber",
        "grnrDate",
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

            const response = await generatePdfReport({
                fromDate: startDate.toISOString().split("T")[0],
                toDate: endDate.toISOString().split("T")[0],
                sortBy,
                order,
                selectedColumns,
            }).unwrap();

            console.log("PDF Report Response:", response);

            if (response && response.url) {
                const fileUri = `${FileSystem.documentDirectory}${response.url.split("/").pop()}`;
                const downloadResumable = FileSystem.createDownloadResumable(
                    response.url,
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
                { label: "GRNR Number", value: "grnrNumber" },
                { label: "GRNR Date", value: "grnrDate" },
                { label: "GRN Number", value: "grnNumber" },
                { label: "GRN Date", value: "grnDate" },
                { label: "Remarks", value: "remarks" },
                { label: "Name", value: "name" },
                { label: "Return Qty", value: "returnQty" },
            ]}
            sortOptions={[
                { label: "GRNR Date", value: "grnrDate" },
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