import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Exporta un componente a PDF basado en un elemento HTML
 * @param {string} elementId - ID del elemento HTML que se va a capturar
 * @param {string} fileName - Nombre del archivo PDF que se va a descargar
 * @param {string} layout - "A4" (default) o "ticket" para tamaño de recibo
 */
export const exportToPDF = async (
  elementId,
  fileName = "document.pdf",
  layout = "A4"
) => {
  const input = document.getElementById(elementId);

  if (!input) {
    console.error(`No se encontró un elemento con el ID: ${elementId}`);
    return;
  }

  try {
    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    if (layout === "ticket") {
      exportTicketPDF(canvas, imgData, fileName);
    } else {
      exportA4PDF(canvas, imgData, fileName);
    }
  } catch (error) {
    console.error("Error generando PDF:", error);
  }
};

const exportA4PDF = (canvas, imgData, fileName) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 190; // A4 width - margin
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (imgHeight > pageHeight) {
    let heightLeft = imgHeight;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      if (heightLeft > 0) {
        pdf.addPage();
        position = 0;
      }
    }
  } else {
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  }

  pdf.save(fileName);
};

const exportTicketPDF = (canvas, imgData, fileName) => {
  const ticketWidth = 80; // 80mm ancho típico de impresoras térmicas
  const imgWidth = ticketWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", [imgHeight + 20, ticketWidth + 20]); // Dinámico en altura
  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  pdf.save(fileName);
};

