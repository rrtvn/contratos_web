import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Genera un PDF a partir de una URL de preview HTML.
 * Abre el HTML en un iframe oculto, lo captura con html2canvas y lo exporta.
 */
export async function exportContractPdf(
  previewUrl: string,
  filename: string = 'contrato.pdf'
): Promise<void> {
  // Crear un iframe temporal
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:794px;height:1123px;border:none;visibility:hidden;';
  document.body.appendChild(iframe);

  await new Promise<void>((resolve, reject) => {
    iframe.onload = () => resolve();
    iframe.onerror = reject;
    iframe.src = previewUrl;
  });

  // Esperar a que los estilos y fonts carguen
  await new Promise(r => setTimeout(r, 1500));

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) throw new Error('No se pudo acceder al documento');

  const element = doc.body;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    windowWidth: 794,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ratio = canvasWidth / canvasHeight;

  let heightLeft = (pdfWidth / ratio) * (canvasHeight / canvasWidth) * (canvasWidth / pdfWidth);
  // Simpler: fit page width, paginate
  const imgHeightMm = (canvasHeight * pdfWidth) / canvasWidth;

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeightMm);

  let position = imgHeightMm;
  while (position < imgHeightMm) {
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, -position, pdfWidth, imgHeightMm);
    position += pdfHeight;
  }

  // Multi-page: paginate canvas
  if (imgHeightMm > pdfHeight) {
    // Re-generate with pagination
    const totalPages = Math.ceil(imgHeightMm / pdfHeight);
    const pdf2 = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf2.addPage();
      const srcY = (page * pdfHeight * canvasWidth) / pdfWidth;
      const srcH = (pdfHeight * canvasWidth) / pdfWidth;

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = srcH;
      const ctx = pageCanvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, srcH);
      ctx.drawImage(canvas, 0, srcY, canvasWidth, srcH, 0, 0, canvasWidth, srcH);

      const pageData = pageCanvas.toDataURL('image/jpeg', 0.95);
      pdf2.addImage(pageData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    document.body.removeChild(iframe);
    pdf2.save(filename);
    return;
  }

  document.body.removeChild(iframe);
  pdf.save(filename);
}

/**
 * Abre el preview en una nueva ventana para impresión del navegador.
 */
export function printContract(previewUrl: string): void {
  const win = window.open(previewUrl, '_blank', 'width=900,height=700');
  if (win) {
    win.addEventListener('load', () => {
      setTimeout(() => win.print(), 800);
    });
  }
}
