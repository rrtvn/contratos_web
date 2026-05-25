import React, { useState } from 'react';
import { Search, User, ChevronRight, Loader, FileText, Download, Printer, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { employeesApi, contractsApi, Employee, ContractAnnex, Contract } from '../services/api';
import { EmployeeCard } from '../components/EmployeeCard';
import { AnnexesManager } from '../components/AnnexesManager';
import { exportContractPdf, printContract } from '../utils/pdfExport';

type Step = 'search' | 'form' | 'preview';

const CONTRACT_TYPES = [
  { value: 'indefinido', label: 'Indefinido' },
  { value: 'plazo_fijo', label: 'Plazo Fijo' },
  { value: 'obra_faena', label: 'Obra o Faena' },
  { value: 'part_time', label: 'Part Time' },
];

const JORNADAS = [
  '45 horas semanales',
  '44 horas semanales',
  '40 horas semanales',
  '30 horas semanales (Part Time)',
  'Jornada parcial a convenir',
];

export function NewContractPage() {
  const [step, setStep] = useState<Step>('search');
  const [rutInput, setRutInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [savedContract, setSavedContract] = useState<Contract | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [annexes, setAnnexes] = useState<ContractAnnex[]>([]);

  // Form state
  const [form, setForm] = useState({
    type: 'indefinido',
    fechaInicio: '',
    fechaTermino: '',
    cargo: '',
    departamento: '',
    sueldoBase: '',
    jornada: '45 horas semanales',
    lugarTrabajo: '',
  });

  const searchEmployee = async () => {
    if (!rutInput.trim()) { toast.error('Ingresa un RUT'); return; }
    setLoading(true);
    try {
      const emp = await employeesApi.findByRut(rutInput.trim());
      setEmployee(emp);
      // Pre-llenar form con datos del empleado
      setForm(f => ({
        ...f,
        cargo: emp.cargo || '',
        departamento: emp.departamento || '',
        sueldoBase: emp.sueldoBase ? String(emp.sueldoBase) : '',
        jornada: emp.jornada || '45 horas semanales',
        lugarTrabajo: emp.ciudad || '',
        fechaInicio: emp.fechaIngreso || '',
      }));
      setStep('form');
      toast.success('Empleado encontrado');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Empleado no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const saveContract = async () => {
    if (!employee) return;
    if (!form.fechaInicio) { toast.error('Ingresa la fecha de inicio'); return; }
    if (!form.cargo) { toast.error('Ingresa el cargo'); return; }
    if (!form.sueldoBase || isNaN(Number(form.sueldoBase))) { toast.error('Ingresa un sueldo base válido'); return; }

    setLoading(true);
    try {
      const contract = await contractsApi.create({
        employeeRut: employee.rut,
        type: form.type,
        fechaInicio: form.fechaInicio,
        fechaTermino: form.fechaTermino || undefined,
        cargo: form.cargo,
        departamento: form.departamento,
        sueldoBase: Number(form.sueldoBase),
        jornada: form.jornada,
        lugarTrabajo: form.lugarTrabajo,
        annexes,
      });
      setSavedContract(contract);
      setStep('preview');
      toast.success('Contrato guardado correctamente');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar contrato');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    if (!savedContract) return;
    setExportingPdf(true);
    try {
      const url = contractsApi.getPreviewUrl(savedContract._id);
      await exportContractPdf(url, `Contrato-${savedContract.contractNumber}.pdf`);
      toast.success('PDF descargado');
    } catch {
      toast.error('Error al generar PDF. Intenta con el botón Imprimir.');
    } finally {
      setExportingPdf(false);
    }
  };

  const handlePrint = () => {
    if (!savedContract) return;
    printContract(contractsApi.getPreviewUrl(savedContract._id));
  };

  const setField = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  // ── Step 1: Search ──────────────────────────────────────────
  if (step === 'search') {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', paddingTop: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'var(--navy)', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 26, color: 'var(--navy)' }}>Nuevo Contrato</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>
            Ingresa el RUT del empleado para cargar sus datos automáticamente
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>RUT del Trabajador</label>
            <input
              value={rutInput}
              onChange={e => setRutInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchEmployee()}
              placeholder="Ej: 12.345.678-9"
              style={{ fontSize: 16 }}
              autoFocus
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }}
            onClick={searchEmployee}
            disabled={loading}
          >
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Buscando...</> : <><Search size={16} /> Buscar empleado</>}
          </button>
        </div>

        <div style={{ marginTop: 16, padding: 14, background: 'var(--sky-light)', borderRadius: 10, border: '1px solid #bfdbfe', fontSize: 12, color: '#1e40af' }}>
          <strong>ℹ️ Nota:</strong> Los datos se obtienen desde la API externa de RRHH configurada. Si el empleado no es encontrado, verifica que el RUT sea correcto o que esté registrado en el sistema externo.
        </div>
      </div>
    );
  }

  // ── Step 2: Form ──────────────────────────────────────────
  if (step === 'form' && employee) {
    return (
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setStep('search')}>← Volver</button>
          <span>Buscar empleado</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>Configurar contrato</span>
        </div>

        <h1 style={{ fontSize: 22, color: 'var(--navy)', marginBottom: 6 }}>Configurar Contrato</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Revisa los datos del empleado y completa las condiciones del contrato</p>

        {/* Employee summary */}
        <div style={{ marginBottom: 24 }}>
          <EmployeeCard employee={employee} />
        </div>

        {/* Contract form */}
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, color: 'var(--navy)', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            Condiciones del Contrato
          </h2>

          <div className="form-grid form-grid-2" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label>Tipo de Contrato *</label>
              <select value={form.type} onChange={e => setField('type', e.target.value)}>
                {CONTRACT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Jornada Laboral *</label>
              <select value={form.jornada} onChange={e => setField('jornada', e.target.value)}>
                {JORNADAS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
          </div>

          <div className="form-grid form-grid-3" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label>Fecha de Inicio *</label>
              <input type="date" value={form.fechaInicio} onChange={e => setField('fechaInicio', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fecha Término {form.type !== 'indefinido' ? '*' : '(si aplica)'}</label>
              <input type="date" value={form.fechaTermino} onChange={e => setField('fechaTermino', e.target.value)}
                disabled={form.type === 'indefinido'} />
            </div>
            <div className="form-group">
              <label>Sueldo Base (CLP) *</label>
              <input
                type="number"
                value={form.sueldoBase}
                onChange={e => setField('sueldoBase', e.target.value)}
                placeholder="Ej: 800000"
                min="0"
              />
            </div>
          </div>

          <div className="form-grid form-grid-2" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label>Cargo *</label>
              <input value={form.cargo} onChange={e => setField('cargo', e.target.value)} placeholder="Cargo en el contrato" />
            </div>
            <div className="form-group">
              <label>Departamento / Área</label>
              <input value={form.departamento} onChange={e => setField('departamento', e.target.value)} placeholder="Ej: Tecnología" />
            </div>
          </div>

          <div className="form-group">
            <label>Lugar de Trabajo</label>
            <input value={form.lugarTrabajo} onChange={e => setField('lugarTrabajo', e.target.value)} placeholder="Ej: Av. Providencia 123, Santiago" />
          </div>
        </div>

        {/* Annexes */}
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <AnnexesManager annexes={annexes} onChange={setAnnexes} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setStep('search')}>Cancelar</button>
          <button className="btn btn-primary btn-lg" onClick={saveContract} disabled={loading}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderTopColor: '#fff' }} /> Guardando...</> : <><CheckCircle size={16} /> Guardar y generar contrato</>}
          </button>
        </div>
      </div>
    );
  }

  // ── Step 3: Preview / Export ──────────────────────────────
  if (step === 'preview' && savedContract) {
    const previewUrl = contractsApi.getPreviewUrl(savedContract._id);

    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>Contrato generado exitosamente</span>
            </div>
            <h1 style={{ fontSize: 22, color: 'var(--navy)' }}>
              {savedContract.contractNumber}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {savedContract.employeeFullName} · {CONTRACT_TYPES.find(t => t.value === savedContract.type)?.label}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => { setStep('search'); setEmployee(null); setSavedContract(null); setRutInput(''); setAnnexes([]); }}>
              <FileText size={15} /> Nuevo contrato
            </button>
            <button className="btn btn-secondary" onClick={handlePrint}>
              <Printer size={15} /> Imprimir
            </button>
            <button className="btn btn-gold btn-lg" onClick={handleExportPdf} disabled={exportingPdf}>
              {exportingPdf ? <><div className="spinner" style={{ width: 16, height: 16, borderTopColor: '#fff' }} /> Generando PDF...</> : <><Download size={16} /> Descargar PDF</>}
            </button>
          </div>
        </div>

        {/* Preview iframe */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{
            background: 'var(--navy)',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{
              flex: 1, background: 'rgba(255,255,255,.1)',
              borderRadius: 6, padding: '4px 12px',
              fontSize: 11, color: 'rgba(255,255,255,.6)',
              textAlign: 'center',
            }}>
              Vista previa — {savedContract.contractNumber}
            </div>
          </div>
          <iframe
            src={previewUrl}
            style={{ width: '100%', height: '80vh', border: 'none', display: 'block' }}
            title="Vista previa del contrato"
          />
        </div>
      </div>
    );
  }

  return null;
}
