import { createSlice } from "@reduxjs/toolkit";
import { fetchEmpleados } from "../thunk/empleadosThunk";

const initialState = {

    empleados: [],
    loading: false,
    error: null,
    getAll: "",
}

const empleadosSlice = createSlice({
    name: "empleados",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
        .addCase(fetchEmpleados.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchEmpleados.fulfilled, (state, action) => {
            state.loading = false;
            state.empleados = action.payload;
        })
        .addCase(fetchEmpleados.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Error al cargar empleados";
        })
    }
});

export default empleadosSlice.reducer;