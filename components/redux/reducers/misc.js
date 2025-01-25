import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  startDate: null,
  endDate: null,
  sortBy: "date",
  order: "asc",
  selectedColumns: ["drNumber", "date", "itemName", "quantity", "amount"],
};

const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setSelectedColumns: (state, action) => {
      state.selectedColumns = action.payload;
    },
  },
});

export const {
  setStartDate,
  setEndDate,
  setSortBy,
  setOrder,
  setSelectedColumns,
} = pdfSlice.actions;

export default pdfSlice;