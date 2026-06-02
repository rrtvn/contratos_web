import { createAsyncThunk } from '@reduxjs/toolkit';
import empleadosService from '../services/empleadoService';

export const fetchEmpleados = createAsyncThunk(
    'empleados/fetchEmpleados'
    , async (_, thunkAPI) => {
    const response = await getEmpleados();
    return response;
});