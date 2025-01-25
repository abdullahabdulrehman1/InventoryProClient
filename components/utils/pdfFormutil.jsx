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
import { Picker } from "@react-native-picker/picker";

const PdfPageUtil = ({
  navigation,
  initialSelectedColumns,
  availableColumns,
  sortOptions,
  fetchPdf, // Fetch PDF function passed as a prop
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [sortBy, setSortBy] = useState(sortOptions[0]?.value || "date");
  const [order, setOrder] = useState("asc");
  const [selectedColumns, setSelectedColumns] = useState(
    initialSelectedColumns
  );

  const toggleColumn = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };
  const handleDownloadPdf = async () => {
 
    Alert.alert(
      "Please Wait",
      "Your request is being processed. This may take a few moments."
    );
  
    try {
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
  
      await fetchPdf({
        fromDate: startDate.toISOString().split("T")[0], // Convert to ISO string
        toDate: endDate.toISOString().split("T")[0], // Convert to ISO string
        selectedColumns,
        sortBy,
        order,
      });
    } catch (error) {
      console.error("Error fetching PDF:", error);
      Alert.alert(
        "Error",
        error.message || "An unexpected error occurred while fetching the PDF."
      );
    }
  };
  

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

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
              minimumDate={oneYearAgo}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  console.log("Start Date Selected:", selectedDate);
                  setStartDate(selectedDate);
                }
              }}
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
              minimumDate={oneYearAgo}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) {
                  console.log("End Date Selected:", selectedDate);
                  setEndDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* Sort By Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Sort By:</Text>
          <Picker
            selectedValue={sortBy}
            onValueChange={(value) => setSortBy(value)}
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
            onValueChange={(value) => setOrder(value)}
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
          <TouchableOpacity style={styles.button} onPress={handleDownloadPdf}>
            <Text style={styles.buttonText}>Download PDF</Text>
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
