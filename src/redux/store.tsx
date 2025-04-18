import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import orderSlice from './OrderSlice'
import formValues from './FormSlice'
import sellerReducer from './SellerSlice';
import tradingWatchlist from './TradingWatchlistSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    orderSlice: orderSlice,
    formValues:formValues,
    seller: sellerReducer,
    tradingWatchlist: tradingWatchlist
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;











// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// export default store;
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;















// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;



// import React from 'react'

// const store = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default store












// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;












// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;
