import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { ContractAnnex } from '../services/api';

const PRESET_ANNEXES = [
  {
    title: 'Confidencialidad y Protección de Datos',
    content: `<p>El Trabajador se obliga a guardar estricta confidencialidad respecto de toda información, datos, documentos, archivos, procesos o cualquier otro antecedente relacionado con las actividades, negocios, clientes, proveedores, tecnologías y sistemas del Empleador, a los que tenga acceso con ocasión de la prestación de sus servicios.</p>
<p>Esta obligación de confidencialidad se mantendrá vigente durante toda la relación laboral y subsistirá por un plazo de 2 (dos) años contados desde la fecha de terminación del contrato, por cualquier causa que éste termine.</p>
<p>El incumplimiento de la presente cláusula facultará al Empleador para ejercer las acciones legales que correspondan, sin perjuicio de las indemnizaciones por daños y perjuicios que procedan.</p>`,
  },
  {
    title: 'Uso de Equipos y Sistemas Informáticos',
    content: `<p>Los equipos computacionales, sistemas y herramientas tecnológicas proporcionadas por el Empleador son de uso exclusivo para el desarrollo de las funciones laborales. El Trabajador se compromete a hacer un uso responsable de dichos recursos.</p>
<p>Queda estrictamente prohibido instalar software no autorizado, acceder a sitios web no relacionados con las funciones laborales en horario de trabajo, o utilizar los equipos para fines personales sin autorización expresa del Empleador.</p>
<p>Al término de la relación laboral, el Trabajador deberá devolver todos los equipos y eliminar cualquier acceso a los sistemas de la empresa.</p>`,
  },
  {
    title: 'Bono de Desempeño',
    content: `<p>El Empleador podrá otorgar al Trabajador un bono de desempeño de carácter esporádico, sujeto al cumplimiento de metas e indicadores de rendimiento que serán definidos periódicamente por la jefatura correspondiente.</p>
<p>Este bono no tiene carácter remuneratorio fijo ni permanente, por lo que su pago en un período no genera derecho a su repetición en períodos posteriores, y no será base de cálculo para gratificaciones ni indemnizaciones.</p>`,
  },
  {
    title: 'Trabajo Remoto / Teletrabajo',
    content: `<p>Las partes acuerdan que el Trabajador podrá desempeñar sus funciones bajo la modalidad de teletrabajo, en los días y condiciones que el Empleador determine, conforme a lo establecido en la Ley N° 21.220 y sus modificaciones.</p>
<p>El Empleador proveerá al Trabajador los equipos necesarios para el desarrollo de sus funciones en modalidad remota. El Trabajador deberá contar con conexión a internet adecuada en el lugar desde donde realice sus funciones.</p>
<p>El Trabajador deberá mantener disponibilidad en los mismos horarios que en el trabajo presencial, salvo acuerdo distinto.</p>`,
  },
  {
    title: 'No Competencia Post Contractual',
    content: `<p>El Trabajador se obliga a no prestar servicios, ya sea como dependiente, independiente, asesor o en cualquier otra calidad, para empresas que sean competidoras directas del Empleador, por un período de 6 (seis) meses contados desde la fecha de término de la relación laboral.</p>
<p>A modo de compensación por esta restricción, el Empleador pagará al Trabajador una suma equivalente a 1 (una) remuneración mensual bruta al momento de la terminación del contrato.</p>`,
  },
];

interface Props {
  annexes: ContractAnnex[];
  onChange: (annexes: ContractAnnex[]) => void;
}

export function AnnexesManager({ annexes, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const addAnnex = (title: string, content: string) => {
    const newAnnex: ContractAnnex = {
      id: `annex-${Date.now()}`,
      title,
      content,
      order: annexes.length + 1,
    };
    onChange([...annexes, newAnnex]);
    setExpanded(newAnnex.id);
    setShowPresets(false);
  };

  const removeAnnex = (id: string) => {
    onChange(annexes.filter(a => a.id !== id).map((a, i) => ({ ...a, order: i + 1 })));
  };

  const updateAnnex = (id: string, field: 'title' | 'content', value: string) => {
    onChange(annexes.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }}>
          Anexos al Contrato
        </h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowPresets(!showPresets)}
          >
            <Plus size={14} /> Anexo preestablecido
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => addAnnex('Nuevo Anexo', '')}
          >
            <Plus size={14} /> Anexo personalizado
          </button>
        </div>
      </div>

      {/* Preset picker */}
      {showPresets && (
        <div className="card" style={{ padding: 12, marginBottom: 12, background: 'var(--sky-light)', border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>
            Seleccionar anexo preestablecido:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {PRESET_ANNEXES.map(p => (
              <button
                key={p.title}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                onClick={() => addAnnex(p.title, p.content)}
              >
                + {p.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Annexes list */}
      {annexes.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '28px 16px',
          color: 'var(--text-muted)', fontSize: 13,
          border: '2px dashed var(--border)', borderRadius: 10,
        }}>
          Sin anexos. Agrega uno preestablecido o crea uno personalizado.
        </div>
      )}

      {annexes.map((annex, index) => (
        <div key={annex.id} className="card" style={{ marginBottom: 8, overflow: 'hidden' }}>
          {/* Annex header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            background: expanded === annex.id ? 'var(--navy)' : 'var(--surface)',
            transition: 'background .2s',
          }}>
            <GripVertical size={14} color="var(--text-muted)" />
            <div style={{
              width: 22, height: 22,
              background: expanded === annex.id ? 'rgba(255,255,255,.2)' : 'var(--bg)',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
              color: expanded === annex.id ? '#fff' : 'var(--text-muted)',
              flexShrink: 0,
            }}>
              {index + 1}
            </div>
            <span style={{
              flex: 1, fontSize: 13, fontWeight: 600,
              color: expanded === annex.id ? '#fff' : 'var(--text)',
            }}>
              {annex.title || 'Sin título'}
            </span>
            <button
              className="btn btn-sm"
              style={{ background: 'transparent', border: 'none', color: expanded === annex.id ? 'rgba(255,255,255,.6)' : 'var(--error)', padding: '4px 8px' }}
              onClick={() => removeAnnex(annex.id)}
            >
              <Trash2 size={14} />
            </button>
            <button
              className="btn btn-sm"
              style={{ background: 'transparent', border: 'none', color: expanded === annex.id ? '#fff' : 'var(--text-muted)', padding: '4px 8px' }}
              onClick={() => setExpanded(expanded === annex.id ? null : annex.id)}
            >
              {expanded === annex.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Annex body */}
          {expanded === annex.id && (
            <div style={{ padding: 14, borderTop: '1px solid var(--border)' }}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label>Título del Anexo</label>
                <input
                  value={annex.title}
                  onChange={e => updateAnnex(annex.id, 'title', e.target.value)}
                  placeholder="Ej: Cláusula de Confidencialidad"
                />
              </div>
              <div className="form-group">
                <label>Contenido (HTML permitido)</label>
                <textarea
                  value={annex.content}
                  onChange={e => updateAnnex(annex.id, 'content', e.target.value)}
                  rows={8}
                  placeholder="Contenido del anexo. Puede incluir etiquetas HTML como <p>, <strong>, <ul>, <li>"
                  style={{ fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
