import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { ProfessorData } from '@/types/professor';

export async function exportSignToPdf(element: HTMLElement, _professor: ProfessorData): Promise<Blob> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Calculate scaling to fit page with margins
  const margin = 0.5;
  const availableWidth = pdfWidth - 2 * margin;
  const availableHeight = pdfHeight - 2 * margin;

  const scale = Math.min(availableWidth / (imgWidth / 96), availableHeight / (imgHeight / 96));
  const scaledWidth = (imgWidth / 96) * scale;
  const scaledHeight = (imgHeight / 96) * scale;

  // Center on page
  const x = (pdfWidth - scaledWidth) / 2;
  const y = (pdfHeight - scaledHeight) / 2;

  pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

  return pdf.output('blob');
}

export async function exportSignAsPng(element: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
}

export async function exportAllSignsToPdf(
  elements: HTMLElement[],
  _professors: ProfessorData[]
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < elements.length; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    const canvas = await html2canvas(elements[i], {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const margin = 0.5;
    const availableWidth = pdfWidth - 2 * margin;
    const availableHeight = pdfHeight - 2 * margin;

    const scale = Math.min(availableWidth / (imgWidth / 96), availableHeight / (imgHeight / 96));
    const scaledWidth = (imgWidth / 96) * scale;
    const scaledHeight = (imgHeight / 96) * scale;

    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
  }

  return pdf.output('blob');
}

export async function exportAllSignsAsZip(
  elements: HTMLElement[],
  professors: ProfessorData[]
): Promise<Blob> {
  const zip = new JSZip();

  for (let i = 0; i < elements.length; i++) {
    const professor = professors[i];
    const canvas = await html2canvas(elements[i], {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const pngBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });

    const fileName = `${professor.lastName}_${professor.firstName}_office_hours.png`.replace(/\s+/g, '_');
    zip.file(fileName, pngBlob);
  }

  return zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printElement(element: HTMLElement): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print');
    return;
  }

  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch {
        return '';
      }
    })
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Office Hours Sign</title>
        <style>
          ${styles}

          @page {
            margin: 0;
            size: auto;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          html, body {
            margin: 0;
            padding: 0;
            font-family: Georgia, serif;
          }

          body {
            padding: 0.5in;
          }

          .sign-card {
            page-break-inside: avoid;
            margin: 0 auto;
          }

          @media print {
            html, body {
              margin: 0;
              padding: 0;
            }

            body {
              padding: 0.25in;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}
