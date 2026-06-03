import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout }    from '@/components/Layout';
import { AppRoutes } from '@/routes/AppRoutes';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily:'DM Sans, sans-serif', fontSize:13 },
          success: { iconTheme: { primary:'#10b981', secondary:'#fff' } },
          error:   { iconTheme: { primary:'#ef4444', secondary:'#fff' } },
        }}
      />
      <Layout>
        <AppRoutes />
      </Layout>
    </>
  );
}
