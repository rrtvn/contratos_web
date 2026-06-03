import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '@/slice/employeeSlice';
import contractReducer from '@/slice/contractSlice';
import uiReducer from '@/slice/uiSlice';

export const store = configureStore({
  reducer: {
    employee: employeeReducer,
    contracts: contractReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
