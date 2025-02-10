export const requisitionFields = [
  {
    name: "drNumber",
    label: "DR #",
    type: "text",
    icon: "document-text-outline",
    placeholder: "Enter DR Number",
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    icon: "calendar-outline",
    placeholder: "dd-mm-yyyy",
  },
  {
    name: "department",
    label: "Department",
    type: "picker",
    icon: "business-outline",
    options: [
      { label: "Select Department", value: "Select Department" },
      { label: "Sales", value: "Sales" },
      { label: "Marketing", value: "Marketing" },
      { label: "Finance", value: "Finance" },
      { label: "HR", value: "HR" },
    ],
  },
  {
    name: "requisitionType",
    label: "Requisition Type",
    type: "picker",
    icon: "list-outline",
    options: [
      { label: "Select Requisition Type", value: "Select Requisition Type" },
      { label: "Purchase Requisition", value: "Purchase Requisition" },
      { label: "Store Requisition", value: "Store Requisition" },
    ],
  },
  {
    name: "headerRemarks",
    label: "Remarks",
    type: "text",
    icon: "chatbox-ellipses-outline",
    placeholder: "Enter Remarks",
  },
];

export const rowFields = [
  {
    name: "level3ItemCategory",
    label: "Item Category",
    placeholder: "Enter Level 3 Item Category",
    type: "text",
    maxLength: 32,
  },
  {
    name: "itemName",
    label: "Item Name",
    placeholder: "Enter Item Name",
    type: "text",
    maxLength: 32,
  },
  {
    name: "uom",
    label: "UOM",
    placeholder: "Enter UOM",
    type: "text",
    maxLength: 10,
  },
  {
    name: "quantity",
    label: "Quantity",
    placeholder: "Enter Quantity",
    type: "number",
  },
  {
    name: "rate",
    label: "Estimated Rate",
    placeholder: "Enter Estimated Rate",
    type: "number",
  },
  {
    name: "amount",
    label: "Estimated Amount",
    placeholder: "Enter Estimated Amount",
    type: "number",
  },
  {
    name: "remarks",
    label: "Remarks",
    placeholder: "Enter Remarks",
    type: "text",
    maxLength: 150,
  },
];