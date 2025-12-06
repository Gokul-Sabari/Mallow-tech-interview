import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await axiosClient.post("/login", { email, password });
      return res.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  error: string | null;
  loginJustHappened: boolean;  // 👈 new
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
  token: null,
  error: null,
  loginJustHappened: false,   // 👈 new
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearLoginFlag(state) {
      state.loginJustHappened = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.loginJustHappened = true; 

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearLoginFlag } = authSlice.actions;
export default authSlice.reducer;

