import React, { useEffect, useState } from 'react';
import { FileText, Search, Trash2, Eye, Download, Printer, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllContracts, deleteContract } from '@/thunk/contractThunks';
import { setCurrentPage } from '@/slice/uiSlice';
import { openPreview } from '@/slice/uiSlice';
import { PreviewModal } from '@/components/PreviewModal';
import { contractsApi } from '@/api/contractsApi';
import { exportContractPdf, printContract } from '@/utils/pdfExport';
import { formatCLP, CONTRACT_TYPE_LABELS, CONTRACT_STATUS_LABELS, CONTRACT_STATUS_CLASS } from '@/utils/formatters';

export function ContractsListPage() {
  const dispatch         = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.contracts);
  const [search,       setSearch]       = useState('');
  const [exportingId,  setExportingId]  = useState<string | null>(null);

  useEffect(() => { dispatch(fetchAllContracts()); }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este contrato? Esta accion no se puede deshacer.')) return;
    const res = await dispatch(deleteContract(id));
    if (deleteContract.fulfilled.match(res)) toast.success('Contrato eliminado');
    else toast.error('Error al eliminar');
  };

  const handleExport = async (id: string, num: string) => {
    setExportingId(id);
    try {
      await exportContractPdf(contractsApi.getPreviewUrl(id), `Contrato-${num}.pdf`);
      toast.success('PDF descargado');
    } catch { toast.error('Error al generar PDF'); }
    finally { setExportingId(null); }
  };

  const filtered = list.filter((c) => {
    const q = search.toLowerCase();
    return c.rutEmpleado.toLowerCase().includes(q) || c.primerNombre.toLowerCase().includes(q) || 
    c.segundoNombre.toLowerCase().includes(q) || c.primerApellido.toLowerCase().includes(q)
    || c.segundoApellido.toLowerCase().includes(q) ||  c.numeroContrato.toLowerCase().includes(q) || c.cargo.toLowerCase().includes(q);
  });

  return (
    <div>
      <PreviewModal/>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:24, color:'var(--navy)' }}>Contratos</h1>
          <p style={{ color:'var(--text-muted)', fontSize:13, marginTop:2 }}>
            {list.length} contrato{list.length !== 1 ? 's' : ''} registrado{list.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-secondary" onClick={() => dispatch(fetchAllContracts())} disabled={loading}>
            <RefreshCw size={14}/> Actualizar
          </button>
          <button className="btn btn-primary" onClick={() => dispatch(setCurrentPage('new-contract'))}>
            + Nuevo Contrato
          </button>
        </div>
      </div>

      <div style={{ position:'relative', marginBottom:16 }}>
        <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por RUT, nombre, N° contrato o cargo..." style={{ paddingLeft:36 }}/>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>
          <div className="spinner" style={{ margin:'0 auto 12px' }}/> Cargando contratos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'46px 24px', color:'var(--text-muted)' }}>
          <FileText size={38} style={{ margin:'0 auto 12px', opacity:.3 }}/>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>{search ? 'Sin resultados' : 'Sin contratos aun'}</div>
          <div style={{ fontSize:13, marginBottom:16 }}>{search ? 'Prueba con otros terminos' : 'Crea tu primer contrato'}</div>
          {!search && <button className="btn btn-primary" onClick={() => dispatch(setCurrentPage('new-contract'))}>+ Nuevo Contrato</button>}
        </div>
      ) : (
        <div className="card" style={{ overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'var(--bg)', borderBottom:'1px solid var(--border)' }}>
                {['N° Contrato','Trabajador','RUT','Cargo','Tipo','Sueldo Base','Estado','Acciones'].map((h) => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c._id} style={{ borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding:'12px 14px', fontSize:11, fontFamily:'monospace', fontWeight:700, color:'var(--navy)' }}>{c.numeroContrato}</td>
                  <td style={{ padding:'12px 14px', fontWeight:500, fontSize:13 }}>{c.primerNombre} {c.segundoNombre} {c.primerApellido} {c.segundoApellido}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'var(--text-muted)', fontFamily:'monospace' }}>{c.rutEmpleado}</td>
                  <td style={{ padding:'12px 14px', fontSize:13 }}>
                    {c.cargo}
                    {c.departamento && <div style={{ fontSize:11, color:'var(--text-muted)' }}>{c.departamento}</div>}
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:12 }}>{CONTRACT_TYPE_LABELS[c.tipoContrato] ?? c.tipoContrato}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, fontWeight:600 }}>{formatCLP(c.sueldoBase)}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <span className={`badge ${CONTRACT_STATUS_CLASS[c.status] ?? 'badge-draft'}`}>
                      {CONTRACT_STATUS_LABELS[c.status] ?? c.status}
                    </span>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-secondary btn-sm" title="Vista previa" onClick={() => dispatch(openPreview(c._id))}><Eye size={13}/></button>
                      <button className="btn btn-secondary btn-sm" title="PDF" onClick={() => handleExport(c._id, c.numeroContrato)} disabled={exportingId===c._id}>
                        {exportingId===c._id ? <div className="spinner" style={{ width:13, height:13 }}/> : <Download size={13}/>}
                      </button>
                      <button className="btn btn-secondary btn-sm" title="Imprimir" onClick={() => printContract(contractsApi.getPreviewUrl(c._id))}><Printer size={13}/></button>
                      <button className="btn btn-danger btn-sm" title="Eliminar" onClick={() => handleDelete(c._id)}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
