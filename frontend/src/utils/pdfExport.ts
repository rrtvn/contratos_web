import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exporta el contrato a PDF paginado A4.
 * Carga el HTML de preview en un iframe, lo captura y pagina.
 */
export async function exportContractPdf(previewUrl: string, filename = 'contrato.pdf'): Promise<void> {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:794px;height:1123px;border:none;visibility:hidden;';
  document.body.appendChild(iframe);

  await new Promise<void>((resolve, reject) => {
    iframe.onload  = () => resolve();
    iframe.onerror = reject;
    iframe.src     = previewUrl;
  });

  await new Promise((r) => setTimeout(r, 1800));

  const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!doc) throw new Error('No se pudo acceder al iframe');

  const canvas = await html2canvas(doc.body, {
    scale: 2, useCORS: true, allowTaint: true,
    backgroundColor: '#ffffff', windowWidth: 794, logging: false,
  });

  const pdfW = 210;
  const pdfH = 297;
  const imgH = (canvas.height * pdfW) / canvas.width;
  const totalPages = Math.ceil(imgH / pdfH);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();
    const srcY = (page * pdfH * canvas.width) / pdfW;
    const srcH = (pdfH * canvas.width) / pdfW;
    const pc   = document.createElement('canvas');
    pc.width   = canvas.width;
    pc.height  = srcH;
    const ctx  = pc.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, srcH);
    ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
    pdf.addImage(pc.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfW, pdfH);
  }

  document.body.removeChild(iframe);
  pdf.save(filename);
}

/** Abre el contrato en ventana nueva y lanza impresion del navegador */
export function printContract(previewUrl: string): void {
  const win = window.open(previewUrl, '_blank', 'width=900,height=720');
  win?.addEventListener('load', () => setTimeout(() => win.print(), 900));
}
