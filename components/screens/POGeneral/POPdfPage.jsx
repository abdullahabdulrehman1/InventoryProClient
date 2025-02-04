import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
    Alert,
    Platform,
    StatusBar,
    StyleSheet
} from "react-native";
import { useGeneratePdfReportMutation } from "../../redux/api/poGeneralApi";
import PdfPageUtil from "../../utils/pdfFormutil";

const POPdfPage = ({ navigation }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("asc");
    const [selectedColumns, setSelectedColumns] = useState([
        "poNumber",
        "date",
        "supplier",
        "store",
        "name",
        "quantity",
        "rate",
        "amount",
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
                { label: "PO Number", value: "poNumber" },
                { label: "Date", value: "date" },
                { label: "Supplier", value: "supplier" },
                { label: "Store", value: "store" },
                { label: "Requisition Type", value: "requisitionType" },
                { label: "Item Name", value: "name" },
                { label: "Quantity", value: "quantity" },
                { label: "Rate", value: "rate" },
                { label: "Total Amount", value: "amount" },
            ]}
            sortOptions={[
                { label: "Date", value: "date" },
               
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

export default POPdfPage;