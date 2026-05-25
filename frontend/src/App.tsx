import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { NewContractPage } from './pages/NewContractPage';
import { ContractsListPage } from './pages/ContractsListPage';
import './styles/global.css';

export default function App() {
  const [page, setPage] = useState('dashboard');

  const renderPage = () => {
    switch (page) {
      case 'dashboard':    return <DashboardPage onNavigate={setPage} />;
      case 'new-contract': return <NewContractPage />;
      case 'contracts':    return <ContractsListPage onNewContract={() => setPage('new-contract')} />;
      default:             return <DashboardPage onNavigate={setPage} />;
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: 13 },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Layout currentPage={page} onNavigate={setPage}>
        {renderPage()}
      </Layout>
    </>
  );
}
