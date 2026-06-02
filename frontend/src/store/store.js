import { configureStore } from '@reduxjs/toolkit';
import empleadosReducer from '../slice/empleadosSlice';

export const store = configureStore({
    reducer: {
        empleados: empleadosReducer,
    }
})