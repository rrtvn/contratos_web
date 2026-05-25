import React, { useEffect, useState } from 'react';
import { FileText, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { contractsApi, Contract } from '../services/api';

interface Props { onNavigate: (page: string) => void; }

export function DashboardPage({ onNavigate }: Props) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contractsApi.findAll()
      .then(setContracts)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: contracts.length,
    draft: contracts.filter(c => c.status === 'draft').length,
    active: contracts.filter(c => c.status === 'active').length,
    recent: contracts.slice(0, 5),
  };

  const formatCLP = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 24, fontFamily: 'DM Serif Display, serif', color: 'var(--navy)', lineHeight: 1 }}>
          {loading ? '—' : value}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, color: 'var(--navy)' }}>Bienvenido</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          Panel de gestión de contratos laborales
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        <StatCard icon={FileText} label="Contratos totales" value={stats.total} color="var(--navy-mid)" />
        <StatCard icon={TrendingUp} label="Activos" value={stats.active} color="var(--success)" />
        <StatCard icon={Users} label="Borradores" value={stats.draft} color="var(--gold)" />
      </div>

      {/* Quick action */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 28 }}>
        <div className="card" style={{ padding: 28, background: 'var(--navy)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 150, height: 150, background: 'rgba(255,255,255,.04)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', right: 20, bottom: -30, width: 100, height: 100, background: 'rgba(255,255,255,.03)', borderRadius: '50%' }} />
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, marginBottom: 8 }}>
            Generar nuevo contrato
          </div>
          <p style={{ fontSize: 13, opacity: .7, marginBottom: 20, maxWidth: 320 }}>
            Busca al trabajador por RUT y genera un contrato con todos sus datos automáticamente.
          </p>
          <button
            className="btn btn-gold"
            onClick={() => onNavigate('new-contract')}
          >
            <Plus size={15} /> Crear contrato
          </button>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 17, color: 'var(--navy)', marginBottom: 12 }}>
            Accesos rápidos
          </div>
          {[
            { label: 'Ver todos los contratos', page: 'contracts', icon: FileText },
          ].map(item => (
            <button key={item.page}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }}
              onClick={() => onNavigate(item.page)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <item.icon size={14} /> {item.label}
              </span>
              <ArrowRight size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* Recent contracts */}
      {stats.recent.length > 0 && (
        <div className="card">
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Contratos recientes</span>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('contracts')}>
              Ver todos <ArrowRight size={12} />
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {stats.recent.map((c, i) => (
                <tr key={c._id} style={{ borderBottom: i < stats.recent.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '11px 20px' }}>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--navy)', fontWeight: 700 }}>{c.contractNumber}</span>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 500 }}>{c.employeeFullName}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{c.cargo}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 600 }}>{formatCLP(c.sueldoBase)}</td>
                  <td style={{ padding: '11px 20px' }}>
                    <span className={`badge ${c.status === 'active' ? 'badge-active' : c.status === 'signed' ? 'badge-signed' : 'badge-draft'}`}>
                      {c.status === 'draft' ? 'Borrador' : c.status === 'active' ? 'Activo' : 'Firmado'}
                    </span>
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
