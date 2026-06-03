// ── Employee ─────────────────────────────────────────────────
export interface Employee {
  _id?: string;
  rut: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  cargo: string;
  titulo: string;
  edad: number;
  nacionalidad: string;
  estadoCivil: string;
  direccion: string;
  comuna: string;
  ciudad: string;
  departamento: string;
  centrosCosto: string;
  sueldoBase: number;
  jornada: string;
  email: string;
  telefono: string;
  source?: 'external' | 'manual';
}

// ── Annex ────────────────────────────────────────────────────
export interface ContractAnnex {
  id: string;
  title: string;
  content: string;
  order: number;
}

// ── Contract ─────────────────────────────────────────────────
export type ContractType   = 'indefinido' | 'plazo_fijo' | 'obra_faena' | 'part_time';
export type ContractStatus = 'draft' | 'signed' | 'active' | 'terminated';

export interface Contract {
  _id: string;
  numeroContrato: string;
  rutEmpleado: string;
  fullName: string;
  fechaInicio: string;
  fechaNacimiento?: string;
  cargo: string;
  titulo: string;
  sueldoBase: number;
  edad: number;
  anexo: ContractAnnex[];
  lugarTrabajo: string;
  jornada: string;
  tipoContrato: ContractType;
  status: ContractStatus;
  departamento: string;
  employeeSnapshot: Employee;
  customFields: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractPayload {
  fullName: string;
  empleadoRut: string;
  tipoContrato: ContractType;
  fechaInicio: string;
  fechaTermino?: string;
  cargo: string;
  departamento?: string;
  sueldoBase: number;
  jornada: string;
  lugarTrabajo?: string;
  customFields?: Record<string, string>;
  anexos?: ContractAnnex[];
}

export type UpdateContractPayload = Partial<CreateContractPayload>;

// ── Redux state shapes ───────────────────────────────────────
export interface EmployeeState {
  current: Employee | null;
  list: Employee[];
  loading: boolean;
  error: string | null;
}

export interface ContractState {
  list: Contract[];
  current: Contract | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export interface UIState {
  currentPage: string;
  sidebarOpen: boolean;
  previewContractId: string | null;
}
