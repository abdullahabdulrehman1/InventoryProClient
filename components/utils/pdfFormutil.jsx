import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const PdfPageUtil = ({
  navigation,
  initialSelectedColumns,
  availableColumns,
  sortOptions,
  fetchPdf,
  onStartDateChange,
  onEndDateChange,
  onSortByChange,
  onOrderChange,
  onSelectedColumnsChange,
  loading, // Receive loading state as prop
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("asc");
  const [selectedColumns, setSelectedColumns] = useState(initialSelectedColumns);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      onStartDateChange(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      onEndDateChange(selectedDate);
    }
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    onSortByChange(value);
  };

  const handleOrderChange = (value) => {
    setOrder(value);
    onOrderChange(value);
  };

  const toggleColumn = (column) => {
    const newSelectedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((c) => c !== column)
      : [...selectedColumns, column];
    setSelectedColumns(newSelectedColumns);
    onSelectedColumnsChange(newSelectedColumns);
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetchPdf();
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
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
      Alert.alert("Error", error.data.message || "An unexpected error occurred");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Generate Report</Text>
        </View>

        {/* Date Pickers */}
        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {startDate ? startDate.toLocaleDateString() : "Select start date"}
            </Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              maximumDate={new Date()}
              onChange={handleStartDateChange}
            />
          )}
        </View>

        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {endDate ? endDate.toLocaleDateString() : "Select end date"}
            </Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              maximumDate={new Date()}
              onChange={handleEndDateChange}
            />
          )}
        </View>

        {/* Sort By Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Sort By:</Text>
          <Picker
            selectedValue={sortBy}
            onValueChange={(value) => handleSortByChange(value)}
          >
            {sortOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>

        {/* Order Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Order:</Text>
          <Picker
            selectedValue={order}
            onValueChange={(value) => handleOrderChange(value)}
          >
            <Picker.Item label="Ascending" value="asc" />
            <Picker.Item label="Descending" value="desc" />
          </Picker>
        </View>

        {/* Column Selection */}
        <View style={styles.columnsContainer}>
          <Text style={styles.label}>Select Columns:</Text>
          {availableColumns.map((col) => (
            <TouchableOpacity
              key={col.value}
              onPress={() => toggleColumn(col.value)}
              style={[
                styles.columnOption,
                selectedColumns.includes(col.value) && styles.selectedColumn,
              ]}
            >
              <Text>{col.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Generate Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleDownloadPdf}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Download PDF</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PdfPageUtil;