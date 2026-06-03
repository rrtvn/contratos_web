import React, { useEffect } from 'react';
import { FileText, TrendingUp, Users, Plus, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllContracts } from '@/thunk/contractThunks';
import { setCurrentPage } from '@/slice/uiSlice';
import { formatCLP, CONTRACT_STATUS_LABELS, CONTRACT_STATUS_CLASS } from '@/utils/formatters';

export function DashboardPage() {
  const dispatch        = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.contracts);

  useEffect(() => { dispatch(fetchAllContracts()); }, [dispatch]);

  const stats = {
    total:  list.length,
    active: list.filter((c) => c.status === 'active').length,
    draft:  list.filter((c) => c.status === 'draft').length,
    recent: list.slice(0, 5),
  };

  const Stat = ({ icon: Icon, label, value, color }: any) => (
    <div className="card" style={{ padding:20, display:'flex', alignItems:'center', gap:16 }}>
      <div style={{ width:46, height:46, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={20} color={color}/>
      </div>
      <div>
        <div style={{ fontSize:24, fontFamily:'DM Serif Display, serif', color:'var(--navy)', lineHeight:1 }}>
          {loading ? '—' : value}
        </div>
        <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3 }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:26 }}>
        <h1 style={{ fontSize:25, color:'var(--navy)' }}>Bienvenido</h1>
        <p style={{ color:'var(--text-muted)', fontSize:13, marginTop:4 }}>Panel de gestion de contratos laborales</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:26 }}>
        <Stat icon={FileText}   label="Contratos totales" value={stats.total}  color="var(--navy-mid)"/>
        <Stat icon={TrendingUp} label="Activos"           value={stats.active} color="var(--success)"/>
        <Stat icon={Users}      label="Borradores"        value={stats.draft}  color="var(--gold)"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:26 }}>
        <div className="card" style={{ padding:26, background:'var(--navy)', color:'#fff', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-20, top:-20, width:140, height:140, background:'rgba(255,255,255,.04)', borderRadius:'50%' }}/>
          <div style={{ fontFamily:'DM Serif Display, serif', fontSize:19, marginBottom:8 }}>Generar nuevo contrato</div>
          <p style={{ fontSize:13, opacity:.7, marginBottom:20, maxWidth:300 }}>
            Busca al trabajador por RUT y genera el contrato con todos sus datos automaticamente.
          </p>
          <button className="btn btn-gold" onClick={() => dispatch(setCurrentPage('new-contract'))}>
            <Plus size={15}/> Crear contrato
          </button>
        </div>
        <div className="card" style={{ padding:22 }}>
          <div style={{ fontFamily:'DM Serif Display, serif', fontSize:16, color:'var(--navy)', marginBottom:12 }}>Accesos rapidos</div>
          <button className="btn btn-secondary" style={{ width:'100%', justifyContent:'space-between' }} onClick={() => dispatch(setCurrentPage('contracts'))}>
            <span style={{ display:'flex', alignItems:'center', gap:8 }}><FileText size={13}/> Ver todos los contratos</span>
            <ArrowRight size={13}/>
          </button>
        </div>
      </div>

      {stats.recent.length > 0 && (
        <div className="card">
          <div style={{ padding:'13px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:600, fontSize:14 }}>Contratos recientes</span>
            <button className="btn btn-secondary btn-sm" onClick={() => dispatch(setCurrentPage('contracts'))}>Ver todos <ArrowRight size={12}/></button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <tbody>
              {stats.recent.map((c, i) => (
                <tr key={c._id} style={{ borderBottom: i < stats.recent.length-1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding:'10px 20px', fontSize:11, fontFamily:'monospace', fontWeight:700, color:'var(--navy)' }}>{c.numeroContrato}</td>
                  <td style={{ padding:'10px 14px', fontSize:13, fontWeight:500 }}>{c.fullName}</td>
                  <td style={{ padding:'10px 14px', fontSize:12, color:'var(--text-muted)' }}>{c.cargo}</td>
                  <td style={{ padding:'10px 14px', fontSize:12, fontWeight:600 }}>{formatCLP(c.sueldoBase)}</td>
                  <td style={{ padding:'10px 20px' }}>
                    <span className={`badge ${CONTRACT_STATUS_CLASS[c.status] ?? 'badge-draft'}`}>
                      {CONTRACT_STATUS_LABELS[c.status] ?? c.status}
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
