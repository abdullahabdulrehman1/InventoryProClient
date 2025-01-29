import { validationMethods } from '../../utils/formValidation'

export const poFields = [
  {
    name: 'poNumber',
    label: 'PO Number',
    type: 'text',
    placeholder: 'Enter PO Number',
    icon: 'document-text-outline',
    validations: [
      { method: validationMethods.required, message: 'PO Number is required' }
    ]
  },
  {
    name: 'date',
    label: 'Date',
    type: 'text',
    placeholder: 'Enter Date (DD-MM-YYYY)',
    icon: 'calendar-outline',
    keyboardType: 'default',
    validations: [
      { method: validationMethods.required, message: 'Date is required' },
      { method: validationMethods.validateDate, message: 'Invalid date format' }
    ]
  },
  {
    name: 'poDelivery',
    label: 'PO Delivery',
    type: 'text',
    placeholder: 'Enter PO Delivery Date (DD-MM-YYYY)',
    icon: 'calendar-outline',
    keyboardType: 'default',
    validations: [
      {
        method: validationMethods.required,
        message: 'PO Delivery Date is required'
      },
      { method: validationMethods.validateDate, message: 'Invalid date format' }
    ]
  },
  {
    name: 'requisitionType',
    label: 'Requisition Type',
    type: 'text',
    placeholder: 'Enter Requisition Type',
    icon: 'list-outline',
    validations: [
      {
        method: validationMethods.required,
        message: 'Requisition Type is required'
      }
    ]
  },
  {
    name: 'supplier',
    label: 'Supplier',
    type: 'text',
    placeholder: 'Enter Supplier',
    icon: 'business-outline',
    validations: [
      { method: validationMethods.required, message: 'Supplier is required' }
    ]
  },
  {
    name: 'store',
    label: 'Store',
    type: 'text',
    placeholder: 'Enter Store',
    icon: 'storefront-outline',
    validations: [
      { method: validationMethods.required, message: 'Store is required' }
    ]
  },
  {
    name: 'payment',
    label: 'Payment',
    type: 'text',
    placeholder: 'Enter Payment',
    icon: 'card-outline',
    validations: [
      { method: validationMethods.required, message: 'Payment is required' }
    ]
  },
  {
    name: 'purchaser',
    label: 'Purchaser',
    type: 'text',
    placeholder: 'Enter Purchaser',
    icon: 'person-outline',
    validations: [
      { method: validationMethods.required, message: 'Purchaser is required' }
    ]
  },
  {
    name: 'remarks',
    label: 'Remarks',
    type: 'text',
    placeholder: 'Enter Remarks',
    icon: 'chatbubble-outline',
    validations: [
      { method: validationMethods.required, message: 'Remarks are required' }
    ]
  }
]

export const rowFields = [
  {
    name: 'prNo',
    label: 'PR No',
    type: 'text',
    placeholder: 'PR No',
    validations: [
      { method: validationMethods.required, message: 'PR No is required' }
    ]
  },
  {
    name: 'department',
    label: 'Department',
    type: 'text',
    placeholder: 'Department',
    validations: [
      { method: validationMethods.required, message: 'Department is required' }
    ]
  },
  {
    name: 'category',
    label: 'Category',
    type: 'text',
    placeholder: 'Category',
    validations: [
      { method: validationMethods.required, message: 'Category is required' }
    ]
  },
  {
    name: 'name',
    label: 'Item Name',
    type: 'text',
    placeholder: 'Item Name',
    validations: [
      { method: validationMethods.required, message: 'Item Name is required' }
    ]
  },
  {
    name: 'uom',
    label: 'UOM',
    type: 'text',
    placeholder: 'UOM',
    validations: [
      { method: validationMethods.required, message: 'UOM is required' }
    ]
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: 'number',
    placeholder: 'Quantity',
    validations: [
      { method: validationMethods.required, message: 'Quantity is required' },
      {
        method: validationMethods.isNumber,
        message: 'Quantity must be a number'
      }
    ]
  },
  {
    name: 'rate',
    label: 'Rate',
    type: 'number',
    placeholder: 'Rate',
    validations: [
      { method: validationMethods.required, message: 'Rate is required' },
      { method: validationMethods.isNumber, message: 'Rate must be a number' }
    ]
  },
 
  {
    name: 'gstPercent',
    label: 'GST Percent',
    type: 'number',
    placeholder: 'GST Percent',
    validations: [
      {
        method: validationMethods.required,
        message: 'GST Percent is required'
      },
      {
        method: validationMethods.isNumber,
        message: 'GST Percent must be a number'
      }
    ]
  },
 
  {
    name: 'discountAmount',
    label: 'Discount Amount',
    type: 'number',
    placeholder: 'Discount Amount',
    validations: [
      {
        method: validationMethods.required,
        message: 'Discount Amount is required'
      },
      {
        method: validationMethods.isNumber,
        message: 'Discount Amount must be a number'
      }
    ]
  },
  {
    name: 'otherChargesAmount',
    label: 'Other Charges Amount',
    type: 'number',
    placeholder: 'Other Charges Amount',
    validations: [
      {
        method: validationMethods.required,
        message: 'Other Charges Amount is required'
      },
      {
        method: validationMethods.isNumber,
        message: 'Other Charges Amount must be a number'
      }
    ]
  },

  {
    name: 'rowRemarks',
    label: 'Row Remarks',
    type: 'text',
    placeholder: 'Row Remarks',
    validations: [
      {
        method: validationMethods.required,
        message: 'Row Remarks are required'
      }
    ]
  }
]
