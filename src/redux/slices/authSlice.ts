// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import axios from "axios";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: "",
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://reqres.in/api/login",
        {
          email: payload.email,
          password: payload.password,
        },
        {
            headers: {
            "x-api-key": 'reqres_1af77f68c54d455b865dfacb1f622a38',   
          }
        }
      );
         console.log("res.data",import.meta.env.API_KEY)
      return res.data;
    } catch (err: any) {
        throw err
      return rejectWithValue(err.response);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
