import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patient: null, // initially empty
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setPatient: (state, action) => {
      state.patient = action.payload;
      // optional persistence
      // localStorage.setItem("active-patient", JSON.stringify(action.payload));
    },

    clearPatient: (state) => {
      state.patient = null;
      // optional persistence
      // localStorage.removeItem("active-patient");
    },
  },
});

export const { setPatient, clearPatient } = patientSlice.actions;
export default patientSlice.reducer;
