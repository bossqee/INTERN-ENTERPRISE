import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { JournalEntry } from '../types';
import { format } from 'date-fns';
import { marked } from 'marked';

export async function exportToPDF(entry: JournalEntry | JournalEntry[]) {
  const entries = Array.isArray(entry) ? entry : [entry];
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Create a hidden container for rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm'; // A4 width
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.padding = '20mm';
  container.className = 'pdf-export-container';
  
  // Add styles
  const style = document.createElement('style');
  style.innerHTML = `
    .pdf-export-container { font-family: sans-serif; }
    .pdf-entry { margin-bottom: 40px; page-break-after: auto; }
    .pdf-header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
    .pdf-title { font-size: 24pt; font-weight: bold; margin-bottom: 5px; color: #1a1a1a; }
    .pdf-date { color: #666; font-size: 12pt; margin-bottom: 15px; }
    .pdf-tools { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .pdf-tool { background: #f0f7ff; color: #0056b3; padding: 4px 10px; border-radius: 4px; font-size: 10pt; border: 1px solid #cce5ff; }
    .pdf-content { font-size: 11pt; line-height: 1.6; color: #333; }
    .pdf-image { max-width: 100%; max-height: 80mm; object-fit: contain; margin-bottom: 20px; border-radius: 8px; border: 1px solid #eee; }
    pre { background: #f8f9fa; padding: 12px; border-radius: 6px; border: 1px solid #e9ecef; overflow-x: auto; font-size: 10pt; }
    code { font-family: 'Courier New', Courier, monospace; background: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
    h1, h2, h3 { color: #2c3e50; margin-top: 20px; }
    ul, ol { padding-left: 20px; }
    blockquote { border-left: 4px solid #dee2e6; padding-left: 15px; color: #6c757d; font-style: italic; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(container);

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const entryDiv = document.createElement('div');
    entryDiv.className = 'pdf-entry';
    
    let imageHtml = '';
    if (e.image) {
      imageHtml = `<img src="${e.image}" class="pdf-image" />`;
    }

    const contentHtml = await marked.parse(e.content);

    entryDiv.innerHTML = `
      <div class="pdf-header">
        <div class="pdf-title">${e.title}</div>
        <div class="pdf-date">${format(new Date(e.date), 'PPPP')}</div>
      </div>
      <div class="pdf-tools">
        ${e.tools.map(t => `<span class="pdf-tool">${t}</span>`).join('')}
      </div>
      ${imageHtml}
      <div class="pdf-content">
        ${contentHtml}
      </div>
    `;
    
    container.appendChild(entryDiv);

    if (i < entries.length - 1) {
      const spacer = document.createElement('div');
      spacer.style.height = '1px';
      spacer.style.pageBreakAfter = 'always';
      container.appendChild(spacer);
    }
  }

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    const filename = entries.length === 1 
      ? `Journal_Entry_${entries[0].date}.pdf`
      : `Internship_Journal_Complete.pdf`;
      
    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
    document.head.removeChild(style);
  }
}
