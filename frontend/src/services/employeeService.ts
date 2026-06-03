import { employeesApi } from '@/api/employeesApi';
import type { Employee } from './types';

/**
 * Capa de negocio para empleados.
 * Los thunks de Redux llaman a este servicio, no a la API directamente.
 */
export const employeeService = {
  findByRut: (rut: string): Promise<Employee> => employeesApi.findByRut(rut),
  getAll: (): Promise<Employee[]> => employeesApi.findAll(),
};
