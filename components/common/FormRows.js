import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from './../styles/FormStyles';

const FormRows = ({ rows, rowFields, handleRowInputChange, removeRow, errors, isSubmitted, disabledFields = [] }) => {
  return (
    <>
      {rows.map((row, index) => (
        <View key={`row-${index}`} style={styles.row}>
          <Text style={styles.rowLabel}>Row {index + 1}</Text>
          {rowFields.map((field) => (
            <View key={`row-${index}-field-${field.name}`}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.rowInput}
                placeholder={field.placeholder}
                value={row[field.name] !== undefined ? String(row[field.name]) : ""}
                onChangeText={(text) => handleRowInputChange(index, field.name, text)}
                keyboardType={field.type === "number" ? "numeric" : "default"}
                maxLength={field.maxLength}
                editable={!disabledFields.includes(field.name)}
              />
              {isSubmitted && errors[`rows[${index}].${field.name}`] && (
                <Text style={styles.errorText}>
                  {errors[`rows[${index}].${field.name}`]}
                </Text>
              )}
            </View>
          ))}
          {index > 0 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeRow(index)}
            >
              <Ionicons name="remove-circle" size={24} color="red" />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </>
  );
};

export default FormRows;