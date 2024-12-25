import { validationMethods } from "../../utils/formValidation";

export const poGeneralValidationRules = [
  {
    field: "poNumber",
    validations: [
      { method: validationMethods.required, message: "PO Number is required" },
      {
        method: validationMethods.maxLength,
        message: "PO Number cannot exceed 10 characters",
        args: [10],
      },
    ],
  },
  {
    field: "date",
    validations: [
      { method: validationMethods.required, message: "Date is required" },
      {
        method: validationMethods.validateDate,
        message: "Invalid date format. Use DD-MM-YYYY.",
      },
    ],
  },
  {
    field: "poDelivery",
    validations: [
      { method: validationMethods.required, message: "PO Delivery is required" },
    ],
  },
  {
    field: "requisitionType",
    validations: [
      {
        method: validationMethods.required,
        message: "Requisition Type is required",
      },
      {
        method: (value) => value !== "Select Requisition Type",
        message: "Requisition Type is required",
      },
    ],
  },
  {
    field: "supplier",
    validations: [
      { method: validationMethods.required, message: "Supplier is required" },
    ],
  },
  {
    field: "store",
    validations: [
      { method: validationMethods.required, message: "Store is required" },
    ],
  },
  {
    field: "payment",
    validations: [
      { method: validationMethods.required, message: "Payment is required" },
    ],
  },
  {
    field: "purchaser",
    validations: [
      { method: validationMethods.required, message: "Purchaser is required" },
    ],
  },
  {
    field: "remarks",
    validations: [
      {
        method: (value) => !value || value.length <= 150,
        message: "Remarks cannot exceed 150 characters",
      },
    ],
  },
  {
    field: "rows",
    validations: {
      prNo: [
        {
          method: validationMethods.required,
          message: "PR No is required",
        },
      ],
      department: [
        {
          method: validationMethods.required,
          message: "Department is required",
        },
      ],
      category: [
        {
          method: validationMethods.required,
          message: "Category is required",
        },
      ],
      name: [
        {
          method: validationMethods.required,
          message: "Item Name is required",
        },
      ],
      uom: [{ method: validationMethods.required, message: "UOM is required" }],
      quantity: [
        { method: validationMethods.required, message: "Quantity is required" },
        {
          method: validationMethods.isNumber,
          message: "Quantity must be a number",
        },
      ],
      rate: [
        { method: validationMethods.required, message: "Rate is required" },
        {
          method: validationMethods.isNumber,
          message: "Rate must be a number",
        },
      ],
      discountAmount: [
        { method: validationMethods.required, message: "Discount Amount is required" },
        {
          method: validationMethods.isNumber,
          message: "Discount Amount must be a number",
        },
      ],
      otherChargesAmount: [
        { method: validationMethods.required, message: "Other Charges Amount is required" },
        {
          method: validationMethods.isNumber,
          message: "Other Charges Amount must be a number",
        },
      ],
      rowRemarks: [
        { method: validationMethods.required, message: "Remarks are required" },
      ],
    },
  },
];