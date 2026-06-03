import { CONTRACT_ACTIONS } from '@/actions/contractActions';
import axiosClient from './axiosClient';
import type { Contract, CreateContractPayload, UpdateContractPayload } from '@/services/types';

export const contractsApi = {
  create: async (p: CreateContractPayload): Promise<Contract> => {
    const { data } = await axiosClient.post<Contract>('/contratos/create', p);
    return data;
  },
  findAll: async (): Promise<Contract[]> => {
    const { data } = await axiosClient.get<Contract[]>('/contratos');
    return data;
  },
  findOne: async (id: string): Promise<Contract> => {
    const { data } = await axiosClient.get<Contract>(`/contratos/${id}`);
    return data;
  },
  findByRut: async (rut: string): Promise<Contract[]> => {
    const { data } = await axiosClient.get<Contract[]>(`/contratos/empleados/${encodeURIComponent(rut)}`);
    return data;
  },
  update: async (id: string, p: UpdateContractPayload): Promise<Contract> => {
    const { data } = await axiosClient.put<Contract>(`/contratos/${id}`, p);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/contratos/${id}`);
  },
  getPreviewUrl: (id: string): string => `/contratos/${id}`,
};
