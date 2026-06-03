import { createAsyncThunk } from '@reduxjs/toolkit';
import { employeeService } from '@/services/employeeService';
import { EMPLOYEE_ACTIONS } from '@/actions/contractActions';
import type { Employee } from '@/services/types';

/** Busca empleado por RUT: API externa con fallback a BD local */
export const findEmployeeByRut = createAsyncThunk<Employee, string>(
  EMPLOYEE_ACTIONS.FIND_BY_RUT,
  async (rut, { rejectWithValue }) => {
    try {
      return await employeeService.findByRut(rut);
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Error al buscar empleado');
    }
  },
);

/** Obtiene lista de empleados en cache local */
export const fetchAllEmployees = createAsyncThunk<Employee[]>(
  EMPLOYEE_ACTIONS.FIND_ALL,
  async (_, { rejectWithValue }) => {
    try {
      return await employeeService.getAll();
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Error al obtener empleados');
    }
  },
);
