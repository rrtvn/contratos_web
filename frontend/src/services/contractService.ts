import { contractsApi } from '@/api/contractsApi';
import type { Contract, CreateContractPayload } from './types';

/**
 * Capa de negocio para contratos.
 */
export const contractService = {
  createContract: (p: CreateContractPayload): Promise<Contract> => contractsApi.create(p),
  getAllContracts: (): Promise<Contract[]> => contractsApi.findAll(),
  getContractsByRut: (rut: string): Promise<Contract[]> => contractsApi.findByRut(rut),
  removeContract: (id: string): Promise<void> => contractsApi.delete(id),
  getPreviewUrl: (id: string): string => contractsApi.getPreviewUrl(id),
};
