import axiosClient from './axiosClient';
import type { Employee } from '@/services/types';

export const employeesApi = {
  findByRut: async (rut: string): Promise<Employee> => {
    const { data } = await axiosClient.get<Employee>(`/empleados/findByRut/${rut}`);
    console.log('API: findByRut', { rut, data });
    return data;
  },
  findAll: async (): Promise<Employee[]> => {
    const { data } = await axiosClient.get<Employee[]>('/empleados');
    return data;
  },
  upsert: async (payload: Partial<Employee>): Promise<Employee> => {
    const { data } = await axiosClient.post<Employee>('/empleados', payload);
    return data;
  },
};
