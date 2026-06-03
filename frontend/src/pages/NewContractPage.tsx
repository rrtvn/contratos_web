import React, { useState } from 'react';
import { Search, ChevronRight, FileText, Download, Printer, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { findEmployeeByRut } from '@/thunk/employeeThunks';
import { createContract } from '@/thunk/contractThunks';
import { clearCurrentEmployee } from '@/slice/employeeSlice';
import { clearCurrentContract } from '@/slice/contractSlice';
import { setCurrentPage } from '@/slice/uiSlice';
import { EmployeeCard } from '@/components/EmployeeCard';
import { AnnexesManager } from '@/components/AnnexesManager';
import { contractsApi } from '@/api/contractsApi';
import { exportContractPdf, printContract } from '@/utils/pdfExport';
import { normalizeRut } from '@/utils/formatters';
import type { ContractAnnex, ContractType } from '@/services/types';

type Step = 'search' | 'form' | 'preview';

const TYPES    = [{ v:'indefinido',label:'Indefinido' },{ v:'plazo_fijo',label:'Plazo Fijo' },{ v:'obra_faena',label:'Obra o Faena' },{ v:'part_time',label:'Part Time' }];
const JORNADAS = ['45 horas semanales','44 horas semanales','40 horas semanales','30 horas semanales (Part Time)','Jornada parcial a convenir'];

export function NewContractPage() {
  const dispatch     = useAppDispatch();
  const employee     = useAppSelector((s) => s.employee.current);
  const empLoading   = useAppSelector((s) => s.employee.loading);
  const empError     = useAppSelector((s) => s.employee.error);
  const saved        = useAppSelector((s) => s.contracts.current);
  const saving       = useAppSelector((s) => s.contracts.saving);
  const saveError    = useAppSelector((s) => s.contracts.error);

  const [step,      setStep]      = useState<Step>('search');
  const [rutInput,  setRutInput]  = useState('');
  const [annexes,   setAnnexes]   = useState<ContractAnnex[]>([]);
  const [exporting, setExporting] = useState(false);
  const [form, setForm] = useState({
    type:'indefinido' as ContractType, fechaInicio:'', fechaTermino:'',
    cargo:'', departamento:'', sueldoBase:'', jornada:'45 horas semanales', lugarTrabajo:'',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => {
    setStep('search'); setRutInput(''); setAnnexes([]);
    setForm({ type:'indefinido', fechaInicio:'', fechaTermino:'', cargo:'', departamento:'', sueldoBase:'', jornada:'45 horas semanales', lugarTrabajo:'' });
    dispatch(clearCurrentEmployee());
    dispatch(clearCurrentContract());
  };

  const handleSearch = async () => {
    if (!rutInput.trim()) { toast.error('Ingresa un RUT'); return; }
    const res = await dispatch(findEmployeeByRut(normalizeRut(rutInput)));
    if (findEmployeeByRut.fulfilled.match(res)) {
      const e = res.payload;
      setForm((f) => ({ ...f, cargo:e.cargo||'', departamento:e.departamento||'', sueldoBase:e.sueldoBase?String(e.sueldoBase):'', jornada:e.jornada||'45 horas semanales', lugarTrabajo:e.ciudad||'', fechaInicio:e.fechaIngreso||'' }));
      setStep('form');
      toast.success('Empleado encontrado');
    } else {
      toast.error(res.payload as string || 'Empleado no encontrado');
    }
  };

  const handleSave = async () => {
    if (!employee) return;
    if (!form.fechaInicio)                          { toast.error('Ingresa fecha de inicio'); return; }
    if (!form.cargo)                                { toast.error('Ingresa el cargo');        return; }
    if (!form.sueldoBase || isNaN(Number(form.sueldoBase))) { toast.error('Sueldo invalido'); return; }
    const res = await dispatch(createContract({
      fullName: [employee.primerNombre, employee.segundoNombre, employee.primerApellido, employee.segundoApellido].filter(Boolean).join(' '),
      empleadoRut:employee.rut, tipoContrato:form.type, fechaInicio:form.fechaInicio,
      fechaTermino:form.fechaTermino||undefined, cargo:form.cargo,
      departamento:form.departamento, sueldoBase:Number(form.sueldoBase),
      jornada:form.jornada, lugarTrabajo:form.lugarTrabajo, 
    }));
    if (createContract.fulfilled.match(res)) { setStep('preview'); toast.success('Contrato guardado'); }
    else toast.error(res.payload as string || 'Error al guardar');
  };

  const handlePdf = async () => {
    if (!saved) return;
    setExporting(true);
    try { await exportContractPdf(contractsApi.getPreviewUrl(saved._id), `Contrato-${saved.numeroContrato}.pdf`); toast.success('PDF descargado'); }
    catch { toast.error('Error al generar PDF'); }
    finally { setExporting(false); }
  };

  // Step 1 — Search
  if (step === 'search') return (
    <div style={{ maxWidth:520, margin:'0 auto', paddingTop:40 }}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <div style={{ width:58, height:58, borderRadius:14, background:'var(--navy)', margin:'0 auto 14px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <FileText size={24} color="#fff"/>
        </div>
        <h1 style={{ fontSize:23, color:'var(--navy)' }}>Nuevo Contrato</h1>
        <p style={{ color:'var(--text-muted)', marginTop:5, fontSize:13 }}>
          Ingresa el RUT del trabajador para cargar sus datos automaticamente
        </p>
      </div>
      <div className="card" style={{ padding:24 }}>
        <div className="form-group" style={{ marginBottom:14 }}>
          <label>RUT del Trabajador</label>
          <input value={rutInput} onChange={(e) => setRutInput(e.target.value)} onKeyDown={(e) => e.key==='Enter' && handleSearch()} placeholder="Ej: 12.345.678-9" style={{ fontSize:15 }} autoFocus/>
        </div>
        {empError && <div style={{ color:'var(--error)', fontSize:12, marginBottom:12, padding:'8px 12px', background:'#fff0f0', borderRadius:8 }}>{empError}</div>}
        <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'11px 0' }} onClick={handleSearch} disabled={empLoading}>
          {empLoading ? <><div className="spinner" style={{ width:16, height:16, borderTopColor:'#fff' }}/> Buscando...</> : <><Search size={15}/> Buscar empleado</>}
        </button>
      </div>
      <div style={{ marginTop:14, padding:13, background:'var(--sky-light)', borderRadius:10, border:'1px solid #bfdbfe', fontSize:12, color:'#1e40af' }}>
        <strong>Nota:</strong> Los datos se obtienen desde la API externa de RRHH configurada en el backend.
      </div>
    </div>
  );

  // Step 2 — Form
  if (step === 'form' && employee) return (
    <div style={{ maxWidth:800, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18, fontSize:13, color:'var(--text-muted)' }}>
        <button className="btn btn-secondary btn-sm" onClick={reset}>← Volver</button>
        <span>Buscar empleado</span><ChevronRight size={13}/>
        <span style={{ color:'var(--text)', fontWeight:600 }}>Configurar contrato</span>
      </div>
      <h1 style={{ fontSize:21, color:'var(--navy)', marginBottom:6 }}>Configurar Contrato</h1>
      <p style={{ color:'var(--text-muted)', fontSize:13, marginBottom:20 }}>Revisa los datos del empleado y completa las condiciones</p>
      <div style={{ marginBottom:22 }}><EmployeeCard/></div>
      <div className="card" style={{ padding:22, marginBottom:22 }}>
        <h2 style={{ fontSize:15, color:'var(--navy)', marginBottom:18, borderBottom:'1px solid var(--border)', paddingBottom:10 }}>Condiciones del Contrato</h2>
        <div className="form-grid form-grid-2" style={{ marginBottom:14 }}>
          <div className="form-group">
            <label>Tipo de Contrato *</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value)}>
              {TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Jornada Laboral *</label>
            <select value={form.jornada} onChange={(e) => set('jornada', e.target.value)}>
              {JORNADAS.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
        </div>
        <div className="form-grid form-grid-3" style={{ marginBottom:14 }}>
          <div className="form-group">
            <label>Fecha de Inicio *</label>
            <input type="date" value={form.fechaInicio} onChange={(e) => set('fechaInicio', e.target.value)}/>
          </div>
          <div className="form-group">
            <label>Fecha Termino {form.type!=='indefinido' ? '*' : '(si aplica)'}</label>
            <input type="date" value={form.fechaTermino} onChange={(e) => set('fechaTermino', e.target.value)} disabled={form.type==='indefinido'}/>
          </div>
          <div className="form-group">
            <label>Sueldo Base (CLP) *</label>
            <input type="number" value={form.sueldoBase} onChange={(e) => set('sueldoBase', e.target.value)} placeholder="Ej: 800000" min="0"/>
          </div>
        </div>
        <div className="form-grid form-grid-2" style={{ marginBottom:14 }}>
          <div className="form-group">
            <label>Cargo *</label>
            <input value={form.cargo} onChange={(e) => set('cargo', e.target.value)}/>
          </div>
          <div className="form-group">
            <label>Departamento / Area</label>
            <input value={form.departamento} onChange={(e) => set('departamento', e.target.value)}/>
          </div>
        </div>
        <div className="form-group">
          <label>Lugar de Trabajo</label>
          <input value={form.lugarTrabajo} onChange={(e) => set('lugarTrabajo', e.target.value)} placeholder="Ej: Av. Providencia 123, Santiago"/>
        </div>
        {saveError && <div style={{ marginTop:12, color:'var(--error)', fontSize:12, padding:'8px 12px', background:'#fff0f0', borderRadius:8 }}>{saveError}</div>}
      </div>
      <div className="card" style={{ padding:22, marginBottom:22 }}>
        <AnnexesManager annexes={annexes} onChange={setAnnexes}/>
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
        <button className="btn btn-secondary" onClick={reset}>Cancelar</button>
        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
          {saving ? <><div className="spinner" style={{ width:16, height:16, borderTopColor:'#fff' }}/> Guardando...</> : <><CheckCircle size={15}/> Guardar y generar contrato</>}
        </button>
      </div>
    </div>
  );

  // Step 3 — Preview
  if (step === 'preview' && saved) {
    const url = contractsApi.getPreviewUrl(saved._id);
    return (
      <div style={{ maxWidth:920, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--success)' }}/>
              <span style={{ fontSize:12, color:'var(--success)', fontWeight:600 }}>Contrato generado exitosamente</span>
            </div>
            <h1 style={{ fontSize:21, color:'var(--navy)' }}>{saved.numeroContrato}</h1>
            <p style={{ color:'var(--text-muted)', fontSize:13 }}>{saved.fullName} · {saved.tipoContrato}</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-secondary" onClick={reset}><FileText size={14}/> Nuevo contrato</button>
            <button className="btn btn-secondary" onClick={() => printContract(url)}><Printer size={14}/> Imprimir</button>
            <button className="btn btn-gold btn-lg" onClick={handlePdf} disabled={exporting}>
              {exporting ? <><div className="spinner" style={{ width:16, height:16, borderTopColor:'#fff' }}/> Generando...</> : <><Download size={15}/> Descargar PDF</>}
            </button>
          </div>
        </div>
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ background:'var(--navy)', padding:'9px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', gap:5 }}>
              {['#ff5f57','#febc2e','#28c840'].map((c) => <div key={c} style={{ width:11, height:11, borderRadius:'50%', background:c }}/>)}
            </div>
            <div style={{ flex:1, background:'rgba(255,255,255,.1)', borderRadius:6, padding:'3px 12px', fontSize:11, color:'rgba(255,255,255,.6)', textAlign:'center' }}>
              Vista previa — {saved.numeroContrato}
            </div>
          </div>
          <iframe src={url} style={{ width:'100%', height:'80vh', border:'none', display:'block' }} title="Contrato"/>
        </div>
      </div>
    );
  }

  return null;
}
