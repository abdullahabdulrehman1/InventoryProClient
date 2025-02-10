import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import ModalStyles from '../styles/ModalStyles'
import FormStyles from '../styles/FormStyles'
import ButtonStyles from '../styles/ButtonStyles'
import ContainerStyles from '../styles/ContainerStyles'

const FormFields = ({
  fields,
  values,
  onChange,
  errors,
  disabledFields = [],
  showDatePickerProp
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentField, setCurrentField] = useState(null)
  const [date, setDate] = useState(new Date())

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    if (selectedDate) {
      setDate(selectedDate)
      const formattedDate = `${String(selectedDate.getDate()).padStart(
        2,
        '0'
      )}-${String(selectedDate.getMonth() + 1).padStart(
        2,
        '0'
      )}-${selectedDate.getFullYear()}`
      onChange(currentField, formattedDate)
    }
  }

  const openDatePicker = fieldName => {
    setCurrentField(fieldName)
    setShowDatePicker(true)
  }

  return (
    <View>
      {fields.map((field, index) => (
        <View key={index} style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name={field.icon} size={20} color='black' />
            <Text style={styles.label}>{field.label}</Text>
          </View>
          {field.type === 'text' && (
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChangeText={text => onChange(field.name, text)}
              editable={!disabledFields.includes(field.name)}
            />
          )}
          {field.type === 'picker' && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={values[field.name]}
                style={styles.picker}
                onValueChange={itemValue => onChange(field.name, itemValue)}
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
          {field.type === 'date' && (
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => openDatePicker(field.name)}
            >
              <Text style={styles.dateButtonText}>
                {values[field.name] ? values[field.name] : field.placeholder}
              </Text>
            </TouchableOpacity>
          )}
          {errors && errors[field.name] && (
            <Text style={styles.errorText}>{errors[field.name]}</Text>
          )}
        </View>
      ))}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode='date'
          display='default'
          onChange={handleDateChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  ...ContainerStyles,
  ...ButtonStyles,
  ...FormStyles,
  ...ModalStyles,
  formGroup: {
    marginBottom: 15
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    marginLeft: 5,
    fontSize: 16
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    marginTop: 5
  },
  picker: {
    width: '100%'
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    justifyContent: 'center'
  },
  dateButtonText: {
    fontSize: 16
  },
  errorText: {
    color: 'red',
    marginTop: 5
  }
})

export default FormFields
