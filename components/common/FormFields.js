import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'

const AnimatedDateButton = ({ onPress, text, placeholder, disabled }) => {
  const scaleValue = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  return (
    <TouchableOpacity
      onPressIn={!disabled ? handlePressIn : null}
      onPressOut={!disabled ? handlePressOut : null}
      onPress={!disabled ? onPress : null}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.dateButton,
          disabled && styles.disabledDateButton,
          { transform: [{ scale: scaleValue }] },
        ]}
      >
        <Text style={[styles.dateButtonText, disabled && styles.disabledDateButtonText]}>
          {text || placeholder}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

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
    <View style={styles.container}>
      {fields.map((field, index) => (
        <View key={index} style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name={field.icon} size={20} color="#00008B" />
            <Text style={styles.label}>{field.label}</Text>
          </View>
          {field.type === 'text' && (
            <TextInput
              style={[
                styles.input,
                disabledFields.includes(field.name) && styles.disabledInput
              ]}
              placeholder={field.placeholder}
              placeholderTextColor="#87CEEB"
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
                enabled={!disabledFields.includes(field.name)}
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
            <AnimatedDateButton
              onPress={() => openDatePicker(field.name)}
              text={values[field.name]}
              placeholder={field.placeholder}
              disabled={disabledFields.includes(field.name)}
            />
          )}
          {errors && errors[field.name] && (
            <Text style={styles.errorText}>{errors[field.name]}</Text>
          )}
        </View>
      ))}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  formGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#00008B',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#87CEFA',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F0F8FF',
    color: '#00008B',
  },
  disabledInput: {
    backgroundColor: '#E6F3FF',
    opacity: 0.7,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#87CEFA',
    borderRadius: 8,
    backgroundColor: '#F0F8FF',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#00008B',
  },
  dateButton: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledDateButton: {
    backgroundColor: '#87CEEB',
    opacity: 0.7,
  },
  disabledDateButtonText: {
    color: '#F0F8FF',
  },
  errorText: {
    color: '#FF4444',
    marginTop: 6,
    fontSize: 14,
  },
})

export default FormFields