import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const FormFields = ({ fields, values, onChange, errors }) => {
  return (
    <View>
      {fields.map((field, index) => (
        <View key={index} style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name={field.icon} size={20} color="black" />
            <Text style={styles.label}>{field.label}</Text>
          </View>
          {field.type === "text" && (
            <TextInput
              style={styles.input}
              value={values[field.name]}
              onChangeText={(text) => onChange(field.name, text)}
              placeholder={field.placeholder}
              keyboardType={field.keyboardType || "default"}
            />
          )}
          {field.type === "picker" && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={values[field.name]}
                style={styles.picker}
                onValueChange={(itemValue) => onChange(field.name, itemValue)}
              >
                {field.options.map((option, idx) => (
                  <Picker.Item
                    key={idx}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          )}
          {errors && errors[field.name] && (
            <Text style={styles.errorText}>{errors[field.name]}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 20,
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginTop: 5,
  },
  picker: {
    padding: 0,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

export default FormFields;
