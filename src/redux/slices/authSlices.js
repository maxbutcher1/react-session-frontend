import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initalState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}
axios.defaults.withCredentials = true;
//const api = "https://butcher.sded.cf";
export const api = "http://localhost:5000";

export const LoginUser = createAsyncThunk("user/LoginUser", async (user, thunkAPI) => {
    try {

        const response = await axios.post(api + "/login", {
            email: user.email,
            password: user.password
        },
            {
                withCredentials: true,
            })
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
})

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
    try {
        const response = await axios.get(api + '/me', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const LogOut = createAsyncThunk("user/LogOut", async () => {
    await axios.delete(api + '/logout');
});

export const editCurrentUser=async (body,id)=>{
   const {data} =  await axios.patch(api+"/users/"+id, body);
    return data;
}

export const deleteUserData=async (id)=>{
    await axios.delete(api+"/users/"+id);

 }

export const authSlice = createSlice({
    name: "auth",
    initialState: initalState,
    reducers: {
        reset: (state) => initalState
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        // Get User Login
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(getMe.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
