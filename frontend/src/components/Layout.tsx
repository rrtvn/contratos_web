import React, { useState } from 'react';
import { FileText, Plus, List, Home, Menu, X, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'new-contract', label: 'Nuevo Contrato', icon: Plus },
    { id: 'contracts', label: 'Contratos', icon: List },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        background: 'var(--navy)',
        transition: 'width .25s cubic-bezier(.4,0,.2,1)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 70,
        }}>
          <div style={{
            width: 32, height: 32,
            background: 'var(--gold)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <FileText size={18} color="#fff" />
          </div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>
                Contratos
              </div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 11, whiteSpace: 'nowrap' }}>
                Sistema de RRHH
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: active ? 'rgba(255,255,255,.12)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,.55)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all .15s',
                  marginBottom: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.06)';
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {active && (
                  <div style={{
                    position: 'absolute', left: 0, top: 4, bottom: 4,
                    width: 3, background: 'var(--gold)', borderRadius: '0 2px 2px 0',
                  }} />
                )}
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && (
                  <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle */}
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: 10,
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: 'rgba(255,255,255,.4)',
              cursor: 'pointer',
              transition: 'color .15s',
            }}
          >
            {sidebarOpen ? <><X size={16} /><span style={{fontSize:12}}>Colapsar</span></> : <ChevronRight size={16} />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>RRHH</span>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>
              {navItems.find(n => n.id === currentPage)?.label || 'Sistema de Contratos'}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, padding: 24 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
