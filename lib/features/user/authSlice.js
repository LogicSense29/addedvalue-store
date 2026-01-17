import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: "EMAIL", // EMAIL | PASSWORD | OTP | SET_PASSWORD
  email: "",
  password: "",
  loading: false,
  error: null,
  otpVerified: false,
  flow: "LOGIN", // LOGIN | SIGNUP | RESET
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setOtp(state, action) {
      state.otp = action.payload;
    },
    clearOtp(state) {
      state.otp = "";
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setFlow(state, action) {
      state.flow = action.payload;
    },
    resetAuth() {
      return initialState;
    },
  },
});

export const { setStep, setEmail, setLoading, setPassword, setOtp, setError, setFlow, resetAuth } =
  authSlice.actions;

export default authSlice.reducer;
