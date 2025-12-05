import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { User } from "../../types/User";

interface UsersState {
  list: User[];
  loading: boolean;
  page: number;
  totalPages: number;
}

const initialState: UsersState = {
  list: [],
  loading: false,
  page: 1,
  totalPages: 1,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page: number) => {
    const res = await axiosClient.get(`/users?page=${page}`);
    return res.data; 
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (user: User) => {
    const res = await axiosClient.post("/users", user);
    return res.data; 
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, user }: { id: number; user: User }) => {
    const res = await axiosClient.put(`/users/${id}`, user);
    return { id, ...res.data };
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number) => {
    await axiosClient.delete(`/users/${id}`);
    return id;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;      
        state.page = action.payload.page;      
        state.totalPages = action.payload.total_pages;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.list = state.list.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload } : u
        );
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      });
  },
});

export const { setPage } = usersSlice.actions;
export default usersSlice.reducer;
