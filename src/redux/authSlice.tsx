import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Load requestToken from localStorage if available
const tokenFromLocalStorage = localStorage.getItem('requestToken');
const selectedValuesFromLocalStorage = localStorage.getItem('selectedDropdownValues');

interface Option {
  id: number;
  label: string;
  value: any;
}

interface AuthState {
  requestToken: string | null;
  selectedDropdownValues: Option[];
}


const initialState: AuthState = {
  requestToken: tokenFromLocalStorage ? JSON.parse(tokenFromLocalStorage) : null, // Initialize from localStorage
  selectedDropdownValues: selectedValuesFromLocalStorage
    ? JSON.parse(selectedValuesFromLocalStorage)
    : [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRequestToken: (state, action: PayloadAction<string>) => {
      state.requestToken = action.payload;
      localStorage.setItem('requestToken', JSON.stringify(action.payload)); // Save token to localStorage
    },
    clearRequestToken: (state) => {
      state.requestToken = null;
      localStorage.removeItem('requestToken'); // Remove token from localStorage on logout or token clear
    },
    
    setSelectedDropdownValues: (state, action: PayloadAction<Option[]>) => {
      state.selectedDropdownValues = action.payload; // Update selected values
      localStorage.setItem('selectedDropdownValues', JSON.stringify(action.payload));
    },
    clearSelectedDropdownValues: (state) => {
      state.selectedDropdownValues = []; // Clear selected values
      localStorage.removeItem('selectedDropdownValues');
    },

    resetAuthState: (state) => {
      state.selectedDropdownValues = [];
      state.requestToken = null; // Reset the token on logout
      localStorage.removeItem('requestToken');
      localStorage.removeItem('selectedDropdownValues');
    },
    
  },
});

export const { setRequestToken, clearRequestToken, setSelectedDropdownValues, clearSelectedDropdownValues, resetAuthState } = authSlice.actions;

export default authSlice.reducer;







// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface AuthState {
//   requestToken: string | null;
// }

// const initialState: AuthState = {
//   requestToken: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setRequestToken: (state, action: PayloadAction<string>) => {
//       state.requestToken = action.payload;
//     },
//     clearRequestToken: (state) => {
//       state.requestToken = null;
//     },
//   },
// });

// export const { setRequestToken, clearRequestToken } = authSlice.actions;

// export default authSlice.reducer;











// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchAuthData, handleRequestToken } from '../api/auth';

// interface AuthState {
//   token: string | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   token: null,
//   loading: false,
//   error: null,
// };

// export const fetchToken = createAsyncThunk(
//   'auth/fetchToken',
//   async ({ code, client }: { code: string; client: string }) => {
//     const data = await handleRequestToken(code, client);
//     return data.token;
//   }
// );

// // export const fetchToken = createAsyncThunk(
// //       '/api/authentications',
// //       async () => {
// //         const data = await fetchAuthData();
// //         return data?.data[0]?.requestToken;
// //       }
// //     );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchToken.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchToken.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload;
//       })
//       .addCase(fetchToken.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch token';
//       });
//   },
// });

// export default authSlice.reducer;



// import React from 'react'

// const authSlice = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default authSlice

















// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface AuthState {
//   token: string | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   token: null,
//   loading: false,
//   error: null,
// };

// // Async login action
// export const login = createAsyncThunk('auth/login', async (appKey: string, { rejectWithValue }) => {
//   try {
//     const response = await axios.get(`https://auth.flattrade.in/?app_key=${appKey}`);
//     return response.data.token; // Assumes the token comes in response.data.token
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || 'Login failed');
//   }
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default authSlice.reducer;

















// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { login as apiLogin } from '../api/auth';
// import { AuthState, LoginResponse } from '../types/includetypes';

// const initialState: AuthState = {
//   token: null,
//   loading: false,
//   error: null,
// };

// export const login = createAsyncThunk('auth/login', async (appKey: any) => {
//   const response: LoginResponse = await apiLogin(appKey);
//   return response.token;
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Login failed';
//       });
//   },
// });

// export default authSlice.reducer;
