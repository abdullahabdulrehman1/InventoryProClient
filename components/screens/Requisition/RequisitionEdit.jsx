import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import FormFields from '../../common/FormFields'
import FormRows from '../../common/FormRows'
import { useUpdateRequisitionMutation } from '../../redux/api/api'
import ButtonStyles from '../../styles/ButtonStyles.js'
import ContainerStyles from '../../styles/ContainerStyles.js'
import FormStyles from '../../styles/FormStyles.js'
import ModalStyles from '../../styles/ModalStyles.js'
import { validateForm } from '../../utils/formValidation'
import ReusableModal from '../../utils/ReusableModal.jsx'
import { requisitionFields, rowFields } from './requisitionFields'
import { requisitionValidationRules } from './requisitionValidation.js'
const RequisitionEdit = ({ navigation, route }) => {
  const { requisition } = route.params
  const [updateRequisition, { isLoading }] = useUpdateRequisitionMutation()

  const formatDate = isoDate => {
    const date = new Date(isoDate)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const [rows, setRows] = useState(requisition.items || [])
  const [formValues, setFormValues] = useState({
    drNumber: requisition.drNumber || '',
    date: formatDate(requisition.date) || '',
    department: requisition.department || '',
    requisitionType: requisition.requisitionType || 'Purchase Requisition',
    headerRemarks: requisition.headerRemarks || ''
  })
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const formData = {
      ...formValues,
      rows
    }
    const validationErrors = validateForm(formData, requisitionValidationRules)
    setErrors(validationErrors)
    setIsFormValid(Object.keys(validationErrors).length === 0)
  }, [formValues, rows])

  useEffect(() => {
    if (isSubmitted) {
      const formData = {
        ...formValues,
        rows
      }
      const validationErrors = validateForm(
        formData,
        requisitionValidationRules
      )
      setErrors(validationErrors)
      setIsFormValid(Object.keys(validationErrors).length === 0)
    }
  }, [formValues, rows, isSubmitted])

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value })
    setIsSubmitted(true)
  }

  const handleRowInputChange = (index, name, value) => {
    const values = rows.map((row, i) =>
      i === index ? { ...row, [name]: value } : row
    )
    setRows(values)
    setIsSubmitted(true)
  }

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        level3ItemCategory: '',
        itemName: '',
        uom: '',
        quantity: '',
        rate: '',
        amount: '',
        remarks: ''
      }
    ])
  }

  const removeRow = index => {
    const values = rows.filter((_, i) => i !== index)
    setRows(values)
  }

  const handleSubmit = async () => {
    const token = await SecureStore.getItemAsync('token')
    const user = await SecureStore.getItemAsync('user')
    const userId = JSON.parse(user)._id
    const items = rows
    const [day, month, year] = formValues.date.split('-')
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString()

    try {
      const response = await updateRequisition({
        token,
        requisitionId: requisition._id,
        updateData: {
          userId,
          drNumber: formValues.drNumber,
          date: isoDate,
          department: formValues.department,
          headerRemarks: formValues.headerRemarks,
          requisitionType: formValues.requisitionType,
          items
        }
      }).unwrap()
      console.log(response)
      setSuccessModalVisible(true)
    } catch (error) {
      console.error('Error response:', error)
      if (error.data && error.data.errors) {
        const errorMessages = error.data.errors.map(err => err.msg).join('\n')
        Alert.alert('Error', errorMessages)
      } else {
        Alert.alert('Error', error.message || 'Something went wrong.')
      }
    }
  }

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false)
    navigation.navigate('RequisitionTabs', {
      screen: 'Data', // Name of your Form tab
      params: {
        shouldRefresh: true // Optional: Add any refresh flags if needed
      }
    })
  }

  return (
    <View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RequisitionTabs', {
                screen: 'Data', // Name of your Form tab
                params: {
                  shouldRefresh: true // Optional: Add any refresh flags if needed
                }
              })
            }
          >
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Requisition</Text>
        </View>
        <FormFields
          fields={requisitionFields}
          values={formValues}
          onChange={handleInputChange}
          errors={isSubmitted ? errors : {}}
        />
        <FormRows
          rows={rows}
          rowFields={rowFields}
          handleRowInputChange={handleRowInputChange}
          removeRow={removeRow}
          errors={errors}
          isSubmitted={isSubmitted}
        />
        <View style={styles.buttonContainer}>
          <Button title='Add Row' onPress={addRow} color='#1b1f26' />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              (!isFormValid || isLoading) && styles.buttonDisabled
            ]}
            onPress={() => {
              if (!isFormValid) {
                const errorMessages = Object.values(errors).flat().join('\n')
                Alert.alert('Validation Errors', errorMessages)
              } else {
                handleSubmit()
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size='small' color='#fff' />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ReusableModal
        visible={successModalVisible}
        onClose={handleSuccessModalClose}
        headerText='Success'
        bodyText='Requisition updated successfully.'
        buttonText='OK'
        onButtonPress={handleSuccessModalClose}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  ...ContainerStyles,
  ...ButtonStyles,
  ...FormStyles,
  ...ModalStyles,
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  }
})

export default RequisitionEdit
