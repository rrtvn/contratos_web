import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { DashboardPage }     from '@/pages/DashboardPage';
import { NewContractPage }   from '@/pages/NewContractPage';
import { ContractsListPage } from '@/pages/ContractsListPage';

/**
 * Router sin React Router DOM: la navegacion se maneja con Redux (ui.currentPage).
 * Si prefieres React Router, reemplaza esto por <Routes> + <Route> normales.
 */
export function AppRoutes() {
  const page = useAppSelector((s) => s.ui.currentPage);

  switch (page) {
    case 'dashboard':    return <DashboardPage/>;
    case 'new-contract': return <NewContractPage/>;
    case 'contracts':    return <ContractsListPage/>;
    default:             return <DashboardPage/>;
  }
}
