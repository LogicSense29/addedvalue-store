import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState =  {
        currentUser: undefined,
        isLoading: false,
        error: null
    }





const register = createAsyncThunk('auth/register', async (userData, {rejectWithValue}) => {
    try{
        // Maps to the final step of registration which creates the user
        const response = await axios.post('/api/auth/set-password', userData)
        return response.data.user
    } catch (err){
        return rejectWithValue(err.response?.data?.error || 'Registration failed')
    }
})

// Login
const login = createAsyncThunk('auth/login', async (userData, {rejectWithValue}) => {
    try{
        const response = await axios.post('/api/auth/login', userData)
        return response.data.user
    } catch (err){
        return rejectWithValue(err.response?.data?.error || 'Login failed')
    }
})

const logout = createAsyncThunk('auth/logout', async (_, {rejectWithValue}) => {
    try {
        await axios.post('/api/auth/logout')
        return null
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Logout failed')
    }
})


const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Server uses HTTP-only cookies, no header needed
      const response = await axios.get("/api/auth/me");
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch user');
    }
  }
);

const userSlice = createSlice(
    {
        name: 'user',
        initialState,
        reducers: {
            userData: (state, action) => {
                state.currentUser = action.payload
            }
        },
       extraReducers : (builders) => {
            builders.addCase(register.pending , (state) => {
                state.isLoading = true
                state.error = null
            })

            builders.addCase(register.fulfilled, (state, actions) => {
                state.isLoading = false;
                state.currentUser = actions.payload;
            });

            builders.addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload
            });

            builders.addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null
            });

            builders.addCase(login.fulfilled, (state, actions) => {
                state.isLoading = false;
                state.currentUser = actions.payload;
            });

            builders.addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload
            });

            builders.addCase(logout.fulfilled, (state) => {
                state.currentUser = null;
            });

            builders.addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            });

            builders.addCase(getCurrentUser.fulfilled, (state, actions) => {
                state.isLoading = false;
                state.currentUser = actions.payload;
            });

            builders.addCase(getCurrentUser.rejected, (state) => {
                state.isLoading = false;
                state.currentUser = null
            });
       }
    }
)

export const { userData } = userSlice.actions;
export { register, login, logout, getCurrentUser };

export default userSlice.reducer;