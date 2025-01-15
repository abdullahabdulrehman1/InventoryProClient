import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  loader: true,
  isAdmin: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    userExist(state, action) {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExist(state) {
      (state.user = null), (state.loader = false);
    },
    setLoading(state, action) {
      state.loader = action.payload;
    },
  },
});
export default authSlice;
export const { userExist, userNotExist, setLoading } = authSlice.actions;


