import React from 'react';
import { Download, Printer } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closePreview } from '@/slice/uiSlice';
import { contractsApi } from '@/api/contractsApi';
import { exportContractPdf, printContract } from '@/utils/pdfExport';
import toast from 'react-hot-toast';

export function PreviewModal() {
  const dispatch   = useAppDispatch();
  const contractId = useAppSelector((s) => s.ui.previewContractId);
  const contract   = useAppSelector((s) => s.contracts.list.find((c) => c._id === contractId));

  if (!contractId) return null;

  const previewUrl = contractsApi.getPreviewUrl(contractId);

  const handlePdf = async () => {
    try {
      await exportContractPdf(previewUrl, `Contrato-${ contractId}.pdf`);
      toast.success('PDF descargado');
    } catch {
      toast.error('Error al generar PDF. Usa Imprimir.');
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
      onClick={() => dispatch(closePreview())}>
      <div style={{ background:'#fff', borderRadius:12, width:'100%', maxWidth:920, height:'90vh', display:'flex', flexDirection:'column', overflow:'hidden' }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ padding:'11px 16px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:600 }}>Vista previa — {contractId}</span>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => printContract(previewUrl)}><Printer size={13}/> Imprimir</button>
            <button className="btn btn-gold btn-sm" onClick={handlePdf}><Download size={13}/> PDF</button>
            <button className="btn btn-secondary btn-sm" onClick={() => dispatch(closePreview())}>✕ Cerrar</button>
          </div>
        </div>
        <iframe src={previewUrl} style={{ flex:1, border:'none' }} title="Contrato"/>
      </div>
    </div>
  );
}
