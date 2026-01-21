import React from "react";
import { obtenerCatalogoPDF } from "../../Functions/obtenerCatalogoPDF";

export default function DescargarCatalogo() {
  const handleDownload = async () => {
    try {
      const pdfBlob = await obtenerCatalogoPDF();

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "catalogo_equipos_medicos_mty.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando catálogo:", error);
      alert("No se pudo generar el catálogo");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <p>
        Descarga el catálogo actualizado para enviarlo a tus clientes
        por correo o WhatsApp.
      </p>

      <button onClick={handleDownload}>
        Descargar catálogo PDF
      </button>
    </div>
  );
}