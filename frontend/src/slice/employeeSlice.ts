import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { findEmployeeByRut, fetchAllEmployees } from '@/thunk/employeeThunks';
import type { Employee, EmployeeState } from '@/services/types';

const initialState: EmployeeState = {
  current: null,
  list: [],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearCurrentEmployee(state) {
      state.current = null;
      state.error = null;
    },
    clearEmployeeError(state) {
      state.error = null;
    },
    setCurrentEmployee(state, action: PayloadAction<Employee>) {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findEmployeeByRut.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(findEmployeeByRut.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(findEmployeeByRut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAllEmployees.pending, (state) => { state.loading = true; })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAllEmployees.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { clearCurrentEmployee, clearEmployeeError, setCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
