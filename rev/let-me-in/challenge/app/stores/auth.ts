import {createSlice, configureStore} from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authed: false,
  },
  reducers: {
    flipped: (state) => {
      state.authed = !state.authed;
    },
    authed: (state) => {
      state.authed = true;
    },
    deauthed: (state) => {
      state.authed = false;
    },
  },
});

export const {authed, deauthed, flipped} = authSlice.actions;
export const authStore = configureStore({reducer: authSlice.reducer});
