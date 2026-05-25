import React from 'react';
import { User, MapPin, Briefcase, Phone, Mail, Calendar } from 'lucide-react';
import { Employee } from '../services/api';

interface Props { employee: Employee; }

export function EmployeeCard({ employee }: Props) {
  const fullName = `${employee.nombres} ${employee.apellidoPaterno} ${employee.apellidoMaterno}`;

  const Info = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    value ? (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ color: 'var(--text-muted)', marginTop: 1, flexShrink: 0 }}>
          <Icon size={14} />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-muted)' }}>{label}</div>
          <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 1 }}>{value}</div>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="card" style={{ padding: 20 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        paddingBottom: 16, marginBottom: 16,
        borderBottom: '2px solid var(--navy-mid)',
      }}>
        <div style={{
          width: 48, height: 48,
          background: 'var(--sky-light)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <User size={22} color="var(--sky)" />
        </div>
        <div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 17, color: 'var(--navy)' }}>
            {fullName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            RUT: <strong>{employee.rut}</strong>
            {employee.cargo && <> · {employee.cargo}</>}
          </div>
        </div>
        <div style={{
          marginLeft: 'auto',
          background: 'var(--gold-light)',
          border: '1px solid #e8c47a',
          borderRadius: 8,
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--gold)',
        }}>
          Empleado verificado ✓
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        <Info icon={Briefcase} label="Cargo" value={employee.cargo} />
        <Info icon={Briefcase} label="Departamento" value={employee.departamento} />
        <Info icon={MapPin} label="Dirección" value={[employee.direccion, employee.comuna, employee.ciudad].filter(Boolean).join(', ')} />
        <Info icon={Calendar} label="Fecha Nacimiento" value={employee.fechaNacimiento} />
        <Info icon={User} label="Nacionalidad" value={employee.nacionalidad} />
        <Info icon={User} label="Estado Civil" value={employee.estadoCivil} />
        <Info icon={Mail} label="Email" value={employee.email} />
        <Info icon={Phone} label="Teléfono" value={employee.telefono} />
      </div>
    </div>
  );
}
