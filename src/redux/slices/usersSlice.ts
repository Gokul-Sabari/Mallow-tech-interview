import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { User } from "../../types/User";
import { fetchLink } from "../../components/fetchLink";

interface UsersState {
  list: User[];
  loading: boolean;
  page: number;
  total_pages: number;
}

const initialState: UsersState = {
  list: [],
  loading: false,
  page: 1,
  total_pages: 1,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page: number, { rejectWithValue }) => {
    try {
      const res = await fetchLink({
        address: `/users?page=${page}`,
        method: "GET",
      });

      return {
        data: res.data,         
        page: res.page,         
        total_pages: res.total_pages,
      };
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to fetch users");
    }
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
      state.total_pages = action.payload.total_pages;
    })
    .addCase(fetchUsers.rejected, (state) => {
      state.loading = false;
    });
}

});

export const { setPage } = usersSlice.actions;
export default usersSlice.reducer;
