import { createAsyncThunk } from '@reduxjs/toolkit';
import { contractService } from '@/services/contractService';
import { CONTRACT_ACTIONS } from '@/actions/contractActions';
import type { Contract, CreateContractPayload } from '@/services/types';

/** Obtiene todos los contratos */
export const fetchAllContracts = createAsyncThunk<Contract[]>(
  CONTRACT_ACTIONS.FIND_ALL,
  async (_, { rejectWithValue }) => {
    try {
      return await contractService.getAllContracts();
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Error al obtener contratos');
    }
  },
);

/** Crea un nuevo contrato */
export const createContract = createAsyncThunk<Contract, CreateContractPayload>(
  CONTRACT_ACTIONS.CREATE,
  async (payload, { rejectWithValue }) => {
    try {
      return await contractService.createContract(payload);
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Error al crear contrato');
    }
  },
);

/** Elimina un contrato por ID, retorna el ID eliminado */
export const deleteContract = createAsyncThunk<string, string>(
  CONTRACT_ACTIONS.DELETE,
  async (id, { rejectWithValue }) => {
    try {
      await contractService.removeContract(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Error al eliminar contrato');
    }
  },
);
