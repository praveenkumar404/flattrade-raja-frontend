import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Load requestToken from localStorage if available
const tokenFromLocalStorage = localStorage.getItem('requestToken');
const selectedValuesFromLocalStorage = localStorage.getItem('selectedDropdownValues');
const OverLaystorePersist = localStorage.getItem('overLaypersist')
const NotifystorePersist = localStorage.getItem('notifications')
const selectedoptionspreadLocalStorage = localStorage.getItem('selectedDropdownspreatobject');

interface Option {
  id: number;
  label: string;
  value: any;
}

interface Notification {
  id: number;
  message: string;
  type:string;
}


interface AuthState {
  requestToken: string | null;
  selectedDropdownValues: Option[];
  overLaypersist: any[];
  notifications: Notification[];
  selectedDropdownspreatobject: any[];
}

const optionsdata = [
  { "id": 1, "label": "Nifty", "value": 26000 },
  { "id": 2, "label": "Banknifty", "value": 26009 },
  { "id": 3, "label": "Niftynxt50", "value": 26013 },
  { "id": 4, "label": "Finnifty", "value": 26037 },
]


const initialState: AuthState = {
  requestToken: tokenFromLocalStorage ? JSON.parse(tokenFromLocalStorage) : null, // Initialize from localStorage
  selectedDropdownValues: selectedValuesFromLocalStorage
    ? JSON.parse(selectedValuesFromLocalStorage)
    : [],
  // overLaypersist:OverLaystorePersist ? JSON.parse(OverLaystorePersist) === true : false,
  overLaypersist: OverLaystorePersist ? JSON.parse(OverLaystorePersist) : [],
  notifications:NotifystorePersist ? JSON.parse(NotifystorePersist) : [],
  selectedDropdownspreatobject:selectedoptionspreadLocalStorage
  ? JSON.parse(selectedoptionspreadLocalStorage)
  : []
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
    

    addObjectByIdToSelectedDropdownspreat: (state, action: PayloadAction<Option>) => {
      const newObject = action.payload;
      // console.log("Incoming object: ", action.payload);
    
      // Check if the newObject exists in `optionsdata` (optional)
      const existsInOptions = optionsdata.some((item) => item.value === newObject.value);
    
      if (existsInOptions) {
        // Add newObject and ensure no duplicates in `selectedDropdownspreatobject`
        const updatedArray = [...state.selectedDropdownspreatobject, newObject].filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.value === item.value) // Remove duplicates by `value`
        );
    
        // Update state
        state.selectedDropdownspreatobject = updatedArray;
    
        // Persist to localStorage
        localStorage.setItem('selectedDropdownspreatobject', JSON.stringify(updatedArray));
      } else {
        console.log("The object does not exist in options data and will not be added.");
      }
    },
    
    

    // Remove an object based on its id
    selectedRemoveIdDropdownspreatobject: (state, action: PayloadAction<any>) => {
      const idToRemove = action.payload;

      // Filter out the object with the specified id
      const updatedArray = state.selectedDropdownspreatobject.filter(
        (item) => item.id !== idToRemove?.id
      );

      // Update state
      state.selectedDropdownspreatobject = updatedArray;

      // Save updated array to localStorage
      localStorage.setItem('selectedDropdownspreatobject', JSON.stringify(updatedArray));
    },

    clearSelectedDropdownValues: (state) => {
      state.selectedDropdownValues = []; // Clear selected values
      localStorage.removeItem('selectedDropdownValues');
    },

    // setoverLaypersist: (state, action: PayloadAction<boolean>) => {
    //   state.overLaypersist = action.payload;
    //   localStorage.setItem('overLaypersist', JSON.stringify(action.payload)); // Save token to localStorage
    // },

    // clearoverLaypersist: (state) => {
    //   state.overLaypersist = false;
    //   localStorage.removeItem('overLaypersist'); // Remove token from localStorage on logout or token clear
    // },

    setoverLaypersist: (state) => {
      // Map selectedDropdownspreatobject to overlay objects with persist=true
      state.overLaypersist = state.selectedDropdownspreatobject.map((obj) => ({
        ...obj,
        persist: true,
      }));

      localStorage.setItem("overLaypersist", JSON.stringify(state.overLaypersist));
    },

    clearoverLaypersist: (state) => {
      state.overLaypersist = [];
      localStorage.removeItem("overLaypersist");
    },


    // setNotifications : (state, action: PayloadAction<Notification[]>) =>{
    //   state.notifications = action.payload;
    //   localStorage.setItem('notifications', JSON.stringify(action.payload));
    // },

    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      localStorage.setItem('notifications', JSON.stringify(action.payload));
    },
    
    addNotification: (state, action: PayloadAction<Notification>) => {
      const newNotification = action.payload;
    
      // Use the spread operator to add the notification immutably
      state.notifications = [...state.notifications, newNotification];
    
      // Persist to localStorage
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    
    updateNotification: (state, action: PayloadAction<Notification>) => {
      const updatedNotification = action.payload;
    
      // Update an existing notification by id
      state.notifications = state.notifications.map((notification) =>
        notification.id === updatedNotification.id
          ? { ...notification, ...updatedNotification } // Merge updates
          : notification
      );
    
      // Persist to localStorage
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    
    removeNotification: (state, action: PayloadAction<number>) => {
      const idToRemove = action.payload;
    
      // Remove a notification immutably
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== idToRemove
      );
    
      // Persist to localStorage
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    

    resetAuthState: (state) => {
      state.selectedDropdownValues = [];
      state.requestToken = null; // Reset the token on logout
      localStorage.removeItem('requestToken');
      localStorage.removeItem('selectedDropdownValues');
    },
    
  },
});

export const { setRequestToken, clearRequestToken, setSelectedDropdownValues, addObjectByIdToSelectedDropdownspreat, selectedRemoveIdDropdownspreatobject, clearSelectedDropdownValues, setNotifications, setoverLaypersist, resetAuthState } = authSlice.actions;

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
