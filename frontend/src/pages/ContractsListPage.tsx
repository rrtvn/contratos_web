import React, { useEffect, useState } from 'react';
import { FileText, Search, Trash2, Eye, Download, Printer, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { contractsApi, Contract } from '../services/api';
import { exportContractPdf, printContract } from '../utils/pdfExport';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador', signed: 'Firmado', active: 'Activo', terminated: 'Terminado',
};

const TYPE_LABELS: Record<string, string> = {
  indefinido: 'Indefinido', plazo_fijo: 'Plazo Fijo',
  obra_faena: 'Obra o Faena', part_time: 'Part Time',
};

const STATUS_CLASSES: Record<string, string> = {
  draft: 'badge-draft', signed: 'badge-signed', active: 'badge-active', terminated: 'badge-term',
};

export function ContractsListPage({ onNewContract }: { onNewContract: () => void }) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await contractsApi.findAll();
      setContracts(data);
    } catch {
      toast.error('Error al cargar contratos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este contrato? Esta acción no se puede deshacer.')) return;
    try {
      await contractsApi.delete(id);
      setContracts(c => c.filter(x => x._id !== id));
      toast.success('Contrato eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleExport = async (contract: Contract) => {
    setExportingId(contract._id);
    try {
      await exportContractPdf(
        contractsApi.getPreviewUrl(contract._id),
        `Contrato-${contract.contractNumber}.pdf`
      );
      toast.success('PDF descargado');
    } catch {
      toast.error('Error al generar PDF');
    } finally {
      setExportingId(null);
    }
  };

  const filtered = contracts.filter(c => {
    const q = search.toLowerCase();
    return (
      c.employeeRut.toLowerCase().includes(q) ||
      c.employeeFullName.toLowerCase().includes(q) ||
      c.contractNumber.toLowerCase().includes(q) ||
      c.cargo.toLowerCase().includes(q)
    );
  });

  const formatCLP = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, color: 'var(--navy)' }}>Contratos</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            {contracts.length} contrato{contracts.length !== 1 ? 's' : ''} registrado{contracts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Actualizar
          </button>
          <button className="btn btn-primary" onClick={onNewContract}>
            + Nuevo Contrato
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por RUT, nombre, número de contrato o cargo..."
          style={{ paddingLeft: 36 }}
        />
      </div>

      {/* Preview modal */}
      {previewId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }} onClick={() => setPreviewId(null)}>
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 900, height: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Vista previa del contrato</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => { const c = contracts.find(x => x._id === previewId); if (c) printContract(contractsApi.getPreviewUrl(c._id)); }}>
                  <Printer size={13} /> Imprimir
                </button>
                <button className="btn btn-gold btn-sm" onClick={() => { const c = contracts.find(x => x._id === previewId); if (c) handleExport(c); }}>
                  <Download size={13} /> PDF
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setPreviewId(null)}>✕ Cerrar</button>
              </div>
            </div>
            <iframe src={contractsApi.getPreviewUrl(previewId)} style={{ flex: 1, border: 'none' }} title="Contrato" />
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          Cargando contratos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{
          textAlign: 'center', padding: '48px 24px',
          color: 'var(--text-muted)',
        }}>
          <FileText size={40} style={{ margin: '0 auto 12px', opacity: .3 }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
            {search ? 'Sin resultados' : 'Sin contratos aún'}
          </div>
          <div style={{ fontSize: 13, marginBottom: 16 }}>
            {search ? 'Prueba con otros términos de búsqueda' : 'Crea tu primer contrato usando el botón de arriba'}
          </div>
          {!search && (
            <button className="btn btn-primary" onClick={onNewContract}>
              + Nuevo Contrato
            </button>
          )}
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['N° Contrato', 'Trabajador', 'RUT', 'Cargo', 'Tipo', 'Sueldo Base', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'left',
                    fontSize: 11, fontWeight: 700, letterSpacing: '.05em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((contract, i) => (
                <tr key={contract._id} style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background .1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--navy)', fontWeight: 700 }}>
                      {contract.contractNumber}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 500, fontSize: 13 }}>
                    {contract.employeeFullName}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {contract.employeeRut}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13 }}>
                    {contract.cargo}
                    {contract.departamento && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{contract.departamento}</div>}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12 }}>
                    {TYPE_LABELS[contract.type] || contract.type}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>
                    {formatCLP(contract.sueldoBase)}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`badge ${STATUS_CLASSES[contract.status] || 'badge-draft'}`}>
                      {STATUS_LABELS[contract.status] || contract.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" title="Vista previa" onClick={() => setPreviewId(contract._id)}>
                        <Eye size={13} />
                      </button>
                      <button className="btn btn-secondary btn-sm" title="Descargar PDF"
                        onClick={() => handleExport(contract)}
                        disabled={exportingId === contract._id}>
                        {exportingId === contract._id
                          ? <div className="spinner" style={{ width: 13, height: 13 }} />
                          : <Download size={13} />
                        }
                      </button>
                      <button className="btn btn-danger btn-sm" title="Eliminar" onClick={() => handleDelete(contract._id)}>
                        <Trash2 size={13} />
                      </button>
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
