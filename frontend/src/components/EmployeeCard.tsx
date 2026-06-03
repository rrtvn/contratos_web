import React from 'react';
import { User, MapPin, Briefcase, Phone, Mail, Calendar } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'7px 0', borderBottom:'1px solid var(--border)' }}>
      <div style={{ color:'var(--text-muted)', marginTop:1, flexShrink:0 }}><Icon size={14}/></div>
      <div>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', color:'var(--text-muted)' }}>{label}</div>
        <div style={{ fontSize:13, color:'var(--text)', marginTop:1 }}>{value}</div>
      </div>
    </div>
  );
}

export function EmployeeCard() {
  const employee = useAppSelector((s) => s.employee.current);
  if (!employee) return null;

  const fullName = [employee.primerNombre, employee.segundoNombre, employee.primerApellido, employee.segundoApellido].filter(Boolean).join(' ');

  return (
    <div className="card" style={{ padding:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, paddingBottom:14, marginBottom:14, borderBottom:'2px solid var(--navy-mid)' }}>
        <div style={{ width:46, height:46, background:'var(--sky-light)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <User size={20} color="var(--sky)"/>
        </div>
        <div>
          <div style={{ fontFamily:'DM Serif Display, serif', fontSize:16, color:'var(--navy)' }}>{fullName}</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>
            RUT: <strong>{employee.rut}</strong>{employee.cargo && <> · {employee.cargo}</>}
          </div>
        </div>
        <div style={{ marginLeft:'auto', background:'var(--gold-light)', border:'1px solid #e8c47a', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:700, color:'var(--gold)' }}>
          Verificado ✓
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 24px' }}>
        <Row icon={Briefcase} label="Cargo"         value={employee.cargo}/>
        <Row icon={Briefcase} label="Departamento"  value={employee.departamento}/>
        <Row icon={MapPin}    label="Direccion"     value={[employee.direccion, employee.comuna, employee.ciudad].filter(Boolean).join(', ')}/>
        <Row icon={Calendar}  label="Fec. Nacimiento" value={employee.fechaNacimiento}/>
        <Row icon={User}      label="Nacionalidad"  value={employee.nacionalidad}/>
        <Row icon={User}      label="Estado Civil"  value={employee.estadoCivil}/>
        <Row icon={Mail}      label="Email"         value={employee.email}/>
        <Row icon={Phone}     label="Telefono"      value={employee.telefono}/>
      </div>
    </div>
  );
}
