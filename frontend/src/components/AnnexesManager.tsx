import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import type { ContractAnnex } from '@/services/types';

const PRESETS = [
  {
    title: 'Confidencialidad y Proteccion de Datos',
    content: '<p>El Trabajador se obliga a guardar estricta confidencialidad respecto de toda informacion, datos, documentos, archivos, procesos o cualquier otro antecedente relacionado con las actividades, negocios, clientes, proveedores, tecnologias y sistemas del Empleador, a los que tenga acceso con ocasion de la prestacion de sus servicios.</p><p>Esta obligacion subsistira por un plazo de 2 anos contados desde la fecha de terminacion del contrato.</p>',
  },
  {
    title: 'Uso de Equipos y Sistemas Informaticos',
    content: '<p>Los equipos computacionales y herramientas tecnologicas proporcionadas por el Empleador son de uso exclusivo para el desarrollo de las funciones laborales. Queda prohibido instalar software no autorizado o utilizar los equipos para fines personales sin autorizacion expresa del Empleador.</p>',
  },
  {
    title: 'Bono de Desempeno',
    content: '<p>El Empleador podra otorgar al Trabajador un bono de desempeno de caracter esporadico, sujeto al cumplimiento de metas e indicadores de rendimiento definidos periodicamente. Este bono no tiene caracter remuneratorio fijo ni permanente.</p>',
  },
  {
    title: 'Trabajo Remoto / Teletrabajo',
    content: '<p>Las partes acuerdan que el Trabajador podra desempenar sus funciones bajo la modalidad de teletrabajo, conforme a la Ley N° 21.220 y sus modificaciones. El Trabajador debera mantener disponibilidad en los mismos horarios que en el trabajo presencial, salvo acuerdo distinto.</p>',
  },
  {
    title: 'No Competencia Post Contractual',
    content: '<p>El Trabajador se obliga a no prestar servicios para empresas competidoras directas del Empleador por un periodo de 6 meses desde el termino de la relacion laboral. A modo de compensacion, el Empleador pagara al Trabajador una suma equivalente a 1 remuneracion mensual bruta.</p>',
  },
];

interface Props { annexes: ContractAnnex[]; onChange: (a: ContractAnnex[]) => void; }

export function AnnexesManager({ annexes, onChange }: Props) {
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const add = (title: string, content: string) => {
    const a: ContractAnnex = { id: `annex-${Date.now()}`, title, content, order: annexes.length + 1 };
    onChange([...annexes, a]);
    setExpanded(a.id);
    setShowPresets(false);
  };

  const remove = (id: string) =>
    onChange(annexes.filter((a) => a.id !== id).map((a, i) => ({ ...a, order: i + 1 })));

  const update = (id: string, field: 'title' | 'content', val: string) =>
    onChange(annexes.map((a) => (a.id === id ? { ...a, [field]: val } : a)));

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <h3 style={{ fontSize:14, fontFamily:'DM Serif Display, serif', color:'var(--navy)' }}>Anexos al Contrato</h3>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowPresets(!showPresets)}>
            <Plus size={13}/> Preestablecido
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => add('Nuevo Anexo', '')}>
            <Plus size={13}/> Personalizado
          </button>
        </div>
      </div>

      {showPresets && (
        <div className="card" style={{ padding:12, marginBottom:12, background:'var(--sky-light)', border:'1px solid #bfdbfe' }}>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--navy)', marginBottom:8 }}>Seleccionar anexo preestablecido:</div>
          {PRESETS.map((p) => (
            <button key={p.title} className="btn btn-secondary btn-sm"
              style={{ justifyContent:'flex-start', textAlign:'left', width:'100%', marginBottom:4 }}
              onClick={() => add(p.title, p.content)}>
              + {p.title}
            </button>
          ))}
        </div>
      )}

      {annexes.length === 0 && (
        <div style={{ textAlign:'center', padding:'24px 16px', color:'var(--text-muted)', fontSize:13, border:'2px dashed var(--border)', borderRadius:10 }}>
          Sin anexos. Agrega uno preestablecido o personalizado.
        </div>
      )}

      {annexes.map((annex, idx) => (
        <div key={annex.id} className="card" style={{ marginBottom:8, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background: expanded===annex.id ? 'var(--navy)' : 'var(--surface)', transition:'background .2s' }}>
            <GripVertical size={14} color="var(--text-muted)"/>
            <div style={{ width:22, height:22, background: expanded===annex.id ? 'rgba(255,255,255,.2)' : 'var(--bg)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color: expanded===annex.id ? '#fff' : 'var(--text-muted)', flexShrink:0 }}>
              {idx + 1}
            </div>
            <span style={{ flex:1, fontSize:13, fontWeight:600, color: expanded===annex.id ? '#fff' : 'var(--text)' }}>
              {annex.title || 'Sin titulo'}
            </span>
            <button className="btn btn-sm" style={{ background:'transparent', border:'none', color:'var(--error)', padding:'4px 8px' }} onClick={() => remove(annex.id)}>
              <Trash2 size={13}/>
            </button>
            <button className="btn btn-sm" style={{ background:'transparent', border:'none', color: expanded===annex.id ? '#fff' : 'var(--text-muted)', padding:'4px 8px' }} onClick={() => setExpanded(expanded===annex.id ? null : annex.id)}>
              {expanded===annex.id ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
            </button>
          </div>
          {expanded===annex.id && (
            <div style={{ padding:14, borderTop:'1px solid var(--border)' }}>
              <div className="form-group" style={{ marginBottom:12 }}>
                <label>Titulo del Anexo</label>
                <input value={annex.title} onChange={(e) => update(annex.id, 'title', e.target.value)}/>
              </div>
              <div className="form-group">
                <label>Contenido (HTML permitido)</label>
                <textarea value={annex.content} onChange={(e) => update(annex.id, 'content', e.target.value)} rows={8} style={{ fontFamily:'monospace', fontSize:12, resize:'vertical' }}/>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
