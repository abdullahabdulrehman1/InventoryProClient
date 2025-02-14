import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import ServerUrl from '../../config/ServerUrl'
import FormFields from '../../common/FormFields'
import FormRows from '../../common/FormRows'
import ReusableButton from '../../utils/reusableButton'

const POGeneral = ({ navigation }) => {
  const [poNumber, setPoNumber] = useState('')
  const [date, setDate] = useState('')
  const [poDelivery, setPoDelivery] = useState('')
  const [requisitionType, setRequisitionType] = useState('')
  const [requisitionRequired, setRequisitionRequired] = useState('No')
  const [requisitionNumber, setRequisitionNumber] = useState('')
  const [supplier, setSupplier] = useState('')
  const [store, setStore] = useState('')
  const [payment, setPayment] = useState('')
  const [purchaser, setPurchaser] = useState('')
  const [remarks, setRemarks] = useState('')
  const [rows, setRows] = useState([
    {
      id: 1,
      prNo: '',
      department: '',
      category: '',
      name: '',
      uom: '',
      quantity: '',
      rate: '',
      discountAmount: '',
      otherChargesAmount: '',
      rowRemarks: ''
    }
  ])
  const [loading, setLoading] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)

  const formFields = [
    {
      name: 'poNumber',
      label: 'PO #',
      placeholder: 'Enter PO #',
      type: 'text',
      icon: 'document-text-outline'
    },
    {
      name: 'date',
      label: 'Date',
      placeholder: 'Enter Date (DD-MM-YYYY)',
      type: 'date',
      icon: 'calendar-outline'
    },
    {
      name: 'poDelivery',
      label: 'PO Delivery',
      placeholder: 'Enter PO Delivery Date',
      type: 'date',
      icon: 'calendar-outline'
    },
    {
      name: 'requisitionType',
      label: 'Requisition Type',
      placeholder: 'Select Requisition Type',
      type: 'picker',
      icon: 'list-outline',
      options: [
        { label: 'Select Requisition Type', value: '' },
        { label: 'Standard', value: 'Standard' },
        { label: 'Urgent', value: 'Urgent' }
      ]
    },
    {
      name: 'requisitionRequired',
      label: 'Requisition Required',
      placeholder: 'Select Yes or No',
      type: 'picker',
      icon: 'list-outline',
      options: [
        { label: 'No', value: 'No' },
        { label: 'Yes', value: 'Yes' }
      ]
    },
    {
      name: 'supplier',
      label: 'Supplier',
      placeholder: 'Enter Supplier',
      type: 'text',
      icon: 'business-outline'
    },
    {
      name: 'store',
      label: 'Store',
      placeholder: 'Enter Store',
      type: 'text',
      icon: 'storefront-outline'
    },
    {
      name: 'payment',
      label: 'Payment',
      placeholder: 'Enter Payment',
      type: 'text',
      icon: 'card-outline'
    },
    {
      name: 'purchaser',
      label: 'Purchaser',
      placeholder: 'Enter Purchaser',
      type: 'text',
      icon: 'person-outline'
    },
    {
      name: 'remarks',
      label: 'Remarks',
      placeholder: 'Enter Remarks',
      type: 'text',
      icon: 'chatbox-ellipses-outline'
    }
  ]

  if (requisitionRequired === 'Yes') {
    formFields.splice(5, 0, {
      name: 'requisitionNumber',
      label: 'Requisition Number',
      placeholder: 'Enter Requisition Number',
      type: 'text',
      icon: 'document-text-outline'
    })
  }

  const rowFields = [
    { name: 'prNo', label: 'PR No', placeholder: 'PR No', type: 'text' },
    {
      name: 'department',
      label: 'Department',
      placeholder: 'Department',
      type: 'text'
    },
    {
      name: 'category',
      label: 'Category',
      placeholder: 'Category',
      type: 'text'
    },
    {
      name: 'name',
      label: 'Item Name',
      placeholder: 'Item Name',
      type: 'text'
    },
    { name: 'uom', label: 'UOM', placeholder: 'UOM', type: 'text' },
    {
      name: 'quantity',
      label: 'Quantity',
      placeholder: 'Quantity',
      type: 'number'
    },
    { name: 'rate', label: 'Rate', placeholder: 'Rate', type: 'number' },
    {
      name: 'discountAmount',
      label: 'Discount Amount',
      placeholder: 'Discount Amount',
      type: 'number'
    },
    {
      name: 'otherChargesAmount',
      label: 'Other Charges Amount',
      placeholder: 'Other Charges Amount',
      type: 'number'
    },
    {
      name: 'rowRemarks',
      label: 'Remarks',
      placeholder: 'Remarks',
      type: 'text'
    }
  ]

  const handleFormChange = (name, value) => {
    switch (name) {
      case 'poNumber':
        setPoNumber(value)
        break
      case 'date':
        setDate(value)
        break
      case 'poDelivery':
        setPoDelivery(value)
        break
      case 'requisitionType':
        setRequisitionType(value)
        break
      case 'requisitionRequired':
        setRequisitionRequired(value)
        break
      case 'requisitionNumber':
        setRequisitionNumber(value)
        break
      case 'supplier':
        setSupplier(value)
        break
      case 'store':
        setStore(value)
        break
      case 'payment':
        setPayment(value)
        break
      case 'purchaser':
        setPurchaser(value)
        break
      case 'remarks':
        setRemarks(value)
        break
      default:
        break
    }
  }

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        prNo: '',
        department: '',
        category: '',
        name: '',
        uom: '',
        quantity: '',
        rate: '',
        discountAmount: '',
        otherChargesAmount: '',
        rowRemarks: ''
      }
    ])
  }

  const removeRow = index => {
    const values = [...rows]
    values.splice(index, 1)
    setRows(values)
  }

  const handleInputChange = (index, name, value) => {
    const values = [...rows]
    values[index][name] = value
    setRows(values)
  }

  const validateDate = date => {
    const regex = /^\d{2}-\d{2}-\d{4}$/
    return regex.test(date)
  }

  const validateForm = () => {
    if (!poNumber) {
      Alert.alert('Validation Error', 'PO Number is required.')
      return false
    }
    if (!validateDate(date)) {
      Alert.alert('Validation Error', 'Invalid date format. Use DD-MM-YYYY.')
      return false
    }
    if (!validateDate(poDelivery)) {
      Alert.alert(
        'Validation Error',
        'Invalid PO Delivery date format. Use DD-MM-YYYY.'
      )
      return false
    }
    if (!requisitionType) {
      Alert.alert('Validation Error', 'Requisition Type is required.')
      return false
    }
    if (!requisitionRequired) {
      Alert.alert('Validation Error', 'Requisition Required is required.')
      return false
    }
    if (requisitionRequired === 'Yes' && !requisitionNumber) {
      Alert.alert('Validation Error', 'Requisition Number is required.')
      return false
    }
    if (!supplier) {
      Alert.alert('Validation Error', 'Supplier is required.')
      return false
    }
    if (!store) {
      Alert.alert('Validation Error', 'Store is required.')
      return false
    }
    if (!payment) {
      Alert.alert('Validation Error', 'Payment is required.')
      return false
    }
    if (!purchaser) {
      Alert.alert('Validation Error', 'Purchaser is required.')
      return false
    }
    if (!remarks) {
      Alert.alert('Validation Error', 'Remarks are required.')
      return false
    }

    for (let row of rows) {
      if (!row.prNo) {
        Alert.alert('Validation Error', 'PR No is required.')
        return false
      }
      if (!row.department) {
        Alert.alert('Validation Error', 'Department is required.')
        return false
      }
      if (!row.category) {
        Alert.alert('Validation Error', 'Category is required.')
        return false
      }
      if (!row.name) {
        Alert.alert('Validation Error', 'Item Name is required.')
        return false
      }
      if (!row.uom) {
        Alert.alert('Validation Error', 'UOM is required.')
        return false
      }
      if (!row.quantity || isNaN(row.quantity)) {
        Alert.alert(
          'Validation Error',
          'Quantity is required and must be a number.'
        )
        return false
      }
      if (!row.rate || isNaN(row.rate)) {
        Alert.alert(
          'Validation Error',
          'Rate is required and must be a number.'
        )
        return false
      }
      if (!row.discountAmount || isNaN(row.discountAmount)) {
        Alert.alert(
          'Validation Error',
          'Discount Amount is required and must be a number.'
        )
        return false
      }
      if (!row.otherChargesAmount || isNaN(row.otherChargesAmount)) {
        Alert.alert(
          'Validation Error',
          'Other Charges Amount is required and must be a number.'
        )
        return false
      }
      if (row.rowRemarks && row.rowRemarks.length > 150) {
        Alert.alert('Validation Error', 'Remarks cannot exceed 150 characters.')
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const token = await SecureStore.getItemAsync('token')
      const user = await SecureStore.getItemAsync('user')
      const userId = JSON.parse(user)._id
      const [day, month, year] = date.split('-')
      const isoDate = new Date(`${year}-${month}-${day}`).toISOString()
      const [deliveryDay, deliveryMonth, deliveryYear] = poDelivery.split('-')
      const isoDeliveryDate = new Date(
        `${deliveryYear}-${deliveryMonth}-${deliveryDay}`
      ).toISOString()

      const formattedRows = rows.map(row => ({
        prNo: row.prNo,
        department: row.department,
        category: row.category,
        name: row.name,
        uom: row.uom,
        quantity: Number(row.quantity),
        rate: Number(row.rate),
        discountAmount: Number(row.discountAmount),
        otherChargesAmount: Number(row.otherChargesAmount),
        rowRemarks: row.rowRemarks,
        excludingTaxAmount: row.excludingTaxAmount
          ? Number(row.excludingTaxAmount)
          : 0 // Ensure excludingTaxAmount is a number
      }))

      const data = {
        userId,
        poNumber,
        date: isoDate,
        poDelivery: isoDeliveryDate,
        requisitionType,
        requisitionRequired,
        requisitionNumber:
          requisitionRequired === 'Yes' ? requisitionNumber : undefined,
        supplier,
        store,
        payment,
        purchaser,
        remarks,
        rows: formattedRows
      }

      const response = await axios.post(
        `${ServerUrl}/poGeneral/createPO`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data.message)
      if (response.status === 201) {
        setSuccessModalVisible(true)
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong.')
      }
    } catch (error) {
      console.error('Error response:', error.response)
      if (error.response) {
        Alert.alert(
          'Error',
          error.response.data.message || 'Something went wrong.'
        )
      } else if (error.request) {
        Alert.alert('Error', 'No response received from server.')
      } else {
        Alert.alert('Error', error.message || 'Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <FormFields
          fields={formFields}
          values={{
            poNumber,
            date,
            poDelivery,
            requisitionType,
            requisitionRequired,
            requisitionNumber,
            supplier,
            store,
            payment,
            purchaser,
            remarks
          }}
          onChange={handleFormChange}
          errors={{}}
        />
        <FormRows
          rows={rows}
          rowFields={rowFields}
          handleRowInputChange={handleInputChange}
          removeRow={removeRow}
          errors={{}}
          isSubmitted={false}
        />
        <ReusableButton onPress={addRow} text='Add Row' loading={false} />
        <ReusableButton
          onPress={handleSubmit}
          text='Submit'
          loading={loading}
        />
      </ScrollView>

      <Modal
        animationType='slide'
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Success</Text>
            <Text style={styles.modalText}>
              Purchase Order created successfully.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSuccessModalVisible(false)
                navigation.navigate('POGTabs', {
                  screen: 'Data', // Name of your Form tab
                  params: {
                    shouldRefresh: true // Optional: Add any refresh flags if needed
                  }
                })
              }}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1
  },
  formGroup: {
    marginBottom: 15
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    marginLeft: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    marginTop: 5
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginTop: 5
  },
  picker: {
    padding: 0
  },
  row: {
    marginBottom: 15,
    position: 'relative'
  },
  rowLabel: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  rowInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    marginBottom: 5
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    width: '100%'
  },
  button: {
    backgroundColor: '#1b1f26',
    padding: 15,
    width: '100%',
    borderRadius: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center'
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20
  }
})

export default POGeneral
