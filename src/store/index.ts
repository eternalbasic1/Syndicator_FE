// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authSlice from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
