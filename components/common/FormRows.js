import React from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import styles from './../styles/FormStyles';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const FormRows = ({ rows, rowFields, handleRowInputChange, removeRow, errors, isSubmitted, disabledFields = [] }) => {
  const scaleValues = rows.map(() => new Animated.Value(1));

  const handlePressIn = (index) => {
    Animated.spring(scaleValues[index], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(scaleValues[index], {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      {rows.map((row, index) => (
        <Animated.View 
          key={`row-${index}`} 
          style={[
            styles.rowContainer,
            { transform: [{ scale: scaleValues[index] }] }
          ]}
        >
          <View style={styles.rowHeader}>
            <Text style={styles.rowLabel}>Row {index + 1}</Text>
            {index > 0 && (
              <AnimatedTouchable
                style={styles.removeButton}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                onPress={() => removeRow(index)}
              >
                <Ionicons name="trash-bin" size={22} color="#FF4444" />
              </AnimatedTouchable>
            )}
          </View>
          
          {rowFields.map((field) => (
            <View key={`row-${index}-field-${field.name}`} style={styles.inputContainer}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={[
                  styles.rowInput,
                  disabledFields.includes(field.name) && styles.disabledInput,
                  isSubmitted && errors[`rows[${index}].${field.name}`] && styles.errorInput
                ]}
                placeholder={field.placeholder}
                placeholderTextColor="#87CEEB"
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
        </Animated.View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#87CEFA',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00008B',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#00008B',
    marginBottom: 6,
    fontWeight: '500',
  },
  rowInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#87CEFA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#00008B',
  },
  disabledInput: {
    backgroundColor: '#E6F3FF',
    opacity: 0.7,
  },
  errorInput: {
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
  },
  removeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
  },
});

export default FormRows;