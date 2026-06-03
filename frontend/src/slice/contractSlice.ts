import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchAllContracts, createContract, deleteContract } from '@/thunk/contractThunks';
import type { Contract, ContractState } from '@/services/types';

const initialState: ContractState = {
  list:    [],
  current: null,
  loading: false,
  saving:  false,
  error:   null,
};

const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setCurrentContract(state, action: PayloadAction<Contract | null>) {
      state.current = action.payload;
    },
    clearContractError(state) {
      state.error = null;
    },
    clearCurrentContract(state) {
      state.current = null;
      state.error   = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchAllContracts.pending,   (state)         => { state.loading = true; state.error = null; })
      .addCase(fetchAllContracts.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAllContracts.rejected,  (state, action) => { state.loading = false; state.error = action.payload as string; });

    // create
    builder
      .addCase(createContract.pending,   (state)         => { state.saving = true; state.error = null; })
      .addCase(createContract.fulfilled, (state, action) => {
        state.saving  = false;
        state.current = action.payload;
        state.list    = [action.payload, ...state.list];
      })
      .addCase(createContract.rejected,  (state, action) => { state.saving = false; state.error = action.payload as string; });

    // delete
    builder
      .addCase(deleteContract.pending,   (state)         => { state.loading = true; })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.loading = false;
        state.list    = state.list.filter((c) => c._id !== action.payload);
        if (state.current?._id === action.payload) state.current = null;
      })
      .addCase(deleteContract.rejected,  (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { setCurrentContract, clearContractError, clearCurrentContract } = contractSlice.actions;
export default contractSlice.reducer;
