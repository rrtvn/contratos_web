import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Types ───────────────────────────────────────────────────
export interface Employee {
  rut: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  nacionalidad: string;
  estadoCivil: string;
  direccion: string;
  comuna: string;
  ciudad: string;
  cargo: string;
  departamento: string;
  centrosCosto: string;
  fechaIngreso: string;
  sueldoBase: number;
  jornada: string;
  email: string;
  telefono: string;
}

export interface ContractAnnex {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Contract {
  _id: string;
  contractNumber: string;
  employeeRut: string;
  employeeFullName: string;
  type: 'indefinido' | 'plazo_fijo' | 'obra_faena' | 'part_time';
  status: 'draft' | 'signed' | 'active' | 'terminated';
  fechaInicio: string;
  fechaTermino?: string;
  cargo: string;
  departamento: string;
  sueldoBase: number;
  jornada: string;
  lugarTrabajo: string;
  employeeSnapshot: Employee;
  customFields: Record<string, string>;
  annexes: ContractAnnex[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractPayload {
  employeeRut: string;
  type: string;
  fechaInicio: string;
  fechaTermino?: string;
  cargo: string;
  departamento: string;
  sueldoBase: number;
  jornada: string;
  lugarTrabajo: string;
  customFields?: Record<string, string>;
  annexes?: ContractAnnex[];
}

// ─── Employees ───────────────────────────────────────────────
export const employeesApi = {
  findByRut: async (rut: string): Promise<Employee> => {
    const { data } = await api.get(`/employees/${encodeURIComponent(rut)}`);
    return data;
  },
};

// ─── Contracts ───────────────────────────────────────────────
export const contractsApi = {
  create: async (payload: CreateContractPayload): Promise<Contract> => {
    const { data } = await api.post('/contracts', payload);
    return data;
  },
  findAll: async (): Promise<Contract[]> => {
    const { data } = await api.get('/contracts');
    return data;
  },
  findOne: async (id: string): Promise<Contract> => {
    const { data } = await api.get(`/contracts/${id}`);
    return data;
  },
  findByRut: async (rut: string): Promise<Contract[]> => {
    const { data } = await api.get(`/contracts/employee/${encodeURIComponent(rut)}`);
    return data;
  },
  update: async (id: string, payload: Partial<CreateContractPayload>): Promise<Contract> => {
    const { data } = await api.put(`/contracts/${id}`, payload);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contracts/${id}`);
  },
  getPreviewUrl: (id: string) => `/api/contracts/${id}/preview`,
};
