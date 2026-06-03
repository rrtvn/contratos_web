/** Formato peso chileno */
export const formatCLP = (n: number): string =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

/** Fecha ISO a texto legible en espanol */
export const formatDateES = (iso?: string): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
};

export const CONTRACT_TYPE_LABELS: Record<string, string> = {
  indefinido: 'Indefinido',
  plazo_fijo: 'Plazo Fijo',
  obra_faena: 'Obra o Faena',
  part_time:  'Part Time',
};

export const CONTRACT_STATUS_LABELS: Record<string, string> = {
  draft:      'Borrador',
  signed:     'Firmado',
  active:     'Activo',
  terminated: 'Terminado',
};

export const CONTRACT_STATUS_CLASS: Record<string, string> = {
  draft:      'badge-draft',
  signed:     'badge-signed',
  active:     'badge-active',
  terminated: 'badge-term',
};

/** Quita puntos del RUT y convierte a mayusculas */
export const normalizeRut = (rut: string): string =>
  rut.replace(/\./g, '').trim().toUpperCase();
