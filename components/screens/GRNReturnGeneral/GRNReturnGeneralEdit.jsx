import { CommonActions } from '@react-navigation/native'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import React, { useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import FormFields from '../../common/FormFields'
import FormRows from '../../common/FormRows'
import ServerUrl from '../../config/ServerUrl'
import { validateForm, validationMethods } from '../../utils/formValidation'
import ReusableButton from '../../utils/reusableButton'
import ReusableModal from '../../utils/ReusableModal'
import { Ionicons } from '@expo/vector-icons'

const GRNReturnGeneralEdit = ({ navigation, route }) => {
  const { grnReturn } = route.params // Assuming grnReturn data is passed via route params

  const formatDate = isoDate => {
    const date = new Date(isoDate)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const [rows, setRows] = useState(
    grnReturn.rows.map(row => ({ ...row })) || []
  )
  const [grnrNumber, setGrnrNumber] = useState(grnReturn.grnrNumber || '')
  const [grnrDate, setGrnrDate] = useState(formatDate(grnReturn.grnrDate) || '')
  const [grnNumber, setGrnNumber] = useState(grnReturn.grnNumber || '')
  const [grnDate, setGrnDate] = useState(formatDate(grnReturn.grnDate) || '')
  const [remarks, setRemarks] = useState(grnReturn.remarks || '')
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const formFields = [
    {
      name: 'grnrNumber',
      label: 'GRNR Number',
      icon: 'document-text-outline',
      type: 'text'
    },
    {
      name: 'grnrDate',
      label: 'GRNR Date',
      icon: 'calendar-outline',
      type: 'date',
      placeholder: 'dd-mm-yyyy'
    },
    {
      name: 'grnNumber',
      label: 'GRN Number',
      icon: 'document-text-outline',
      type: 'text'
    },
    {
      name: 'grnDate',
      label: 'GRN Date',
      icon: 'calendar-outline',
      type: 'date',
      placeholder: 'dd-mm-yyyy'
    },
    {
      name: 'remarks',
      label: 'Remarks',
      icon: 'chatbox-ellipses-outline',
      type: 'text'
    }
  ]

  const rowFields = [
    { name: 'action', label: 'Action', placeholder: 'Action' },
    { name: 'serialNo', label: 'Serial No', placeholder: 'Serial No' },
    { name: 'category', label: 'Category', placeholder: 'Category' },
    { name: 'name', label: 'Name', placeholder: 'Name' },
    { name: 'unit', label: 'Unit', placeholder: 'Unit' },
    {
      name: 'grnQty',
      label: 'GRN Qty',
      placeholder: 'GRN Qty',
      type: 'number'
    },
    {
      name: 'previousReturnQty',
      label: 'Previous Return Qty',
      placeholder: 'Previous Return Qty',
      type: 'number'
    },
    {
      name: 'balanceGrnQty',
      label: 'Balance GRN Qty',
      placeholder: 'Balance GRN Qty',
      type: 'number'
    },
    {
      name: 'returnQty',
      label: 'Return Qty',
      placeholder: 'Return Qty',
      type: 'number'
    },
    { name: 'rowRemarks', label: 'Row Remarks', placeholder: 'Row Remarks' }
  ]

  const handleInputChange = (name, value) => {
    switch (name) {
      case 'grnrNumber':
        setGrnrNumber(value)
        break
      case 'grnrDate':
        setGrnrDate(value)
        break
      case 'grnNumber':
        setGrnNumber(value)
        break
      case 'grnDate':
        setGrnDate(value)
        break
      case 'remarks':
        setRemarks(value)
        break
      default:
        break
    }
  }

  const handleRowInputChange = (index, name, value) => {
    const newRows = [...rows]
    newRows[index][name] = value
    setRows(newRows)
  }

  const removeRow = index => {
    const newRows = rows.filter((_, i) => i !== index)
    setRows(newRows)
  }

  const addRow = () => {
    setRows([
      ...rows,
      {
        action: '',
        serialNo: '',
        category: '',
        name: '',
        unit: '',
        grnQty: '',
        previousReturnQty: '',
        balanceGrnQty: '',
        returnQty: '',
        rowRemarks: ''
      }
    ])
  }

  const handleSubmit = async () => {
    setIsSubmitted(true)
    const validationRules = [
      {
        field: 'grnrNumber',
        validations: [
          {
            method: validationMethods.required,
            message: 'GRNR Number is required'
          }
        ]
      },
      {
        field: 'grnrDate',
        validations: [
          {
            method: validationMethods.required,
            message: 'GRNR Date is required'
          },
          {
            method: validationMethods.validateDate,
            message: 'GRNR Date must be in dd-mm-yyyy format'
          }
        ]
      },
      {
        field: 'grnDate',
        validations: [
          {
            method: validationMethods.required,
            message: 'GRN Date is required'
          },
          {
            method: validationMethods.validateDate,
            message: 'GRN Date must be in dd-mm-yyyy format'
          }
        ]
      },
      {
        field: 'remarks',
        validations: [
          {
            method: validationMethods.required,
            message: 'Remarks are required'
          }
        ]
      },
      {
        field: 'rows',
        validations: {
          action: [
            {
              method: validationMethods.required,
              message: 'Action is required'
            }
          ],
          serialNo: [
            {
              method: validationMethods.required,
              message: 'Serial No is required'
            }
          ],
          category: [
            {
              method: validationMethods.required,
              message: 'Category is required'
            }
          ],
          name: [
            { method: validationMethods.required, message: 'Name is required' }
          ],
          unit: [
            { method: validationMethods.required, message: 'Unit is required' }
          ],
          grnQty: [
            {
              method: validationMethods.required,
              message: 'GRN Qty is required'
            },
            {
              method: validationMethods.isNumber,
              message: 'GRN Qty must be a number'
            }
          ],
          previousReturnQty: [
            {
              method: validationMethods.required,
              message: 'Previous Return Qty is required'
            },
            {
              method: validationMethods.isNumber,
              message: 'Previous Return Qty must be a number'
            }
          ],
          balanceGrnQty: [
            {
              method: validationMethods.required,
              message: 'Balance GRN Qty is required'
            },
            {
              method: validationMethods.isNumber,
              message: 'Balance GRN Qty must be a number'
            }
          ],
          returnQty: [
            {
              method: validationMethods.required,
              message: 'Return Qty is required'
            },
            {
              method: validationMethods.isNumber,
              message: 'Return Qty must be a number'
            }
          ],
          rowRemarks: [
            {
              method: validationMethods.maxLength,
              args: [150],
              message: 'Row Remarks must be less than 150 characters'
            }
          ]
        }
      }
    ]

    const formData = {
      id: grnReturn._id,
      grnrNumber,
      grnrDate,
      grnNumber,
      grnDate,
      remarks,
      rows
    }
    const validationErrors = validateForm(formData, validationRules)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true)
      try {
        const token = await SecureStore.getItemAsync('token')
        const user = await SecureStore.getItemAsync('user')
        const userId = JSON.parse(user)._id
        console.log(
          'Request URL:',
          `${ServerUrl}/grnReturnGeneral/edit-grn-return-general`
        )
        console.log('Request Payload:', {
          id: grnReturn._id,
          grnrNumber,
          grnrDate,
          grnNumber,
          grnDate,
          remarks,
          rows
        })
        const response = await axios.put(
          `${ServerUrl}/grnReturnGeneral/edit-grn-return-general`,
          {
            id: grnReturn._id,
            grnrNumber,
            grnrDate,
            grnNumber,
            grnDate,
            remarks,
            rows
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (response.status === 200) {
          setSuccessModalVisible(true)
        } else {
          Alert.alert('Error', response.data.message || 'Something went wrong.')
        }
      } catch (error) {
        console.error('Error:', error)
        Alert.alert('Error', 'An error occurred while updating the GRN Return.')
      } finally {
        setLoading(false)
      }
    } else {
      const firstError = Object.values(validationErrors)[0]
      setErrorMessage(firstError)
      setErrorModalVisible(true)
    }
  }

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false)
    navigation.navigate('GRNReturnTabs', {
      screen: 'GRNReturnData',

      params: {
        shouldRefresh: true // Optional: Add any refresh flags if needed
      }
    })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('GRNReturnTabs', {
              screen: 'GRNReturnData',

              params: {
                shouldRefresh: true // Optional: Add any refresh flags if needed
              }
            })
          }
        >
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <Text style={styles.header}>Issue Return Edit</Text>
      </View>
      <FormFields
        fields={formFields}
        values={{
          grnrNumber,
          grnrDate,
          grnNumber,
          grnDate,
          remarks
        }}
        onChange={handleInputChange}
        errors={errors}
      />
      <FormRows
        rows={rows}
        rowFields={rowFields}
        handleRowInputChange={handleRowInputChange}
        removeRow={removeRow}
        errors={errors}
        isSubmitted={isSubmitted}
      />
      <ReusableButton onPress={addRow} text='Add Row' />
      <ReusableButton onPress={handleSubmit} loading={loading} text='Submit' />

      <ReusableModal
        visible={successModalVisible}
        onClose={handleSuccessModalClose}
        headerText='Success'
        bodyText='GRN Return General updated successfully.'
        buttonText='OK'
        onButtonPress={handleSuccessModalClose}
      />
      <ReusableModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        headerText='Error'
        bodyText={errorMessage}
        buttonText='OK'
        onButtonPress={() => setErrorModalVisible(false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10
  },
})

export default GRNReturnGeneralEdit
