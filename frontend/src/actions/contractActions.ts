/**
 * Constantes de tipo para los createAsyncThunk.
 * Centraliza los nombres de accion para evitar errores de tipeo.
 */
export const CONTRACT_ACTIONS = {
  FIND_ALL:  'contratos/findAll',
  CREATE:     'contratos/create',
  DELETE:     'contratos/delete',
  FIND_ONE:  'contratos/findByRut',
} as const;

export const EMPLOYEE_ACTIONS = {
  FIND_BY_RUT: 'empleados/findByRut',
  FIND_ALL:   'empleados/findAll',
} as const;
