import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
    Alert,
    Platform,
    StatusBar,
    StyleSheet
} from "react-native";
import { useGeneratePdfReportMutation } from "../../redux/api/issueReturnApi";
import PdfPageUtil from "../../utils/pdfFormutil";

const IssueReturnPdfPage = ({ navigation }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortBy, setSortBy] = useState("issueQty");
    const [order, setOrder] = useState("asc");
    const [selectedColumns, setSelectedColumns] = useState([
        "irNumber",
        "drNumber",
        "drDate",
        "remarks",
        "itemName",
        "issueQty",
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
                { label: "IR Number", value: "irNumber" },
                { label: "DR Number", value: "drNumber" },
                { label: "DR Date", value: "drDate" },
                { label: "Issue Date", value: "irDate" },
                { label: "Remarks", value: "remarks" },
                { label: "Item Name", value: "itemName" },
                { label: "Issue Qty", value: "issueQty" },
                { label: "Return Qty", value: "returnQty" },
            ]}
            sortOptions={[
                { label: "DR Date", value: "drDate" },
                { label: "Issue Date", value: "irDate" },
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

export default IssueReturnPdfPage;