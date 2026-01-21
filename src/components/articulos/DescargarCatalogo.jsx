import React from "react";
import { obtenerCatalogoPDF } from "../../Functions/obtenerCatalogo";

export default function DescargarCatalogo() {
    const handleDownload = async () => {
        try {
            const pdfBlob = await obtenerCatalogoPDF();

            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "catalogo_equipos_medicos.pdf";
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error descargando catálogo:", error);
        }
    };

    return (
        <button onClick={handleDownload}>
            Descargar catálogo PDF
        </button>
    );
}
