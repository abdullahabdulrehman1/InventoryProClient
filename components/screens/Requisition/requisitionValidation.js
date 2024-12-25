import { validationMethods } from "../../utils/formValidation";

export const requisitionValidationRules = [
  {
    field: "drNumber",
    validations: [
      { method: validationMethods.required, message: "DR Number is required" },
      {
        method: validationMethods.maxLength,
        message: "DR Number cannot exceed 10 characters",
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
    field: "department",
    validations: [
      { method: validationMethods.required, message: "Department is required" },
      {
        method: (value) => value !== "Select Department",
        message: "Department is required",
      },
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
    field: "headerRemarks",
    validations: [
      {
        method: (value) => !value || value.length <= 150,
        message: "Header Remarks cannot exceed 150 characters",
      },
    ],
  },
  {
    field: "rows",
    validations: {
      level3ItemCategory: [
        {
          method: validationMethods.required,
          message: "Level 3 Item Category is required",
        },
      ],
      itemName: [
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
      amount: [
        { method: validationMethods.required, message: "Amount is required" },
        {
          method: validationMethods.isNumber,
          message: "Amount must be a number",
        },
      ],
      remarks: [
        { method: validationMethods.required, message: "Remarks are required" },
      ],
    },
  },
];
