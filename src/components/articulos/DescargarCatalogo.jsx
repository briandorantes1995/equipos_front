import React from "react";
import html2pdf from "html2pdf.js";
import "./DescargarCatalogo.css";

export default function DescargarCatalogo() {
    const handleDownload = () => {
        const element = document.getElementById("catalogo-pdf");

        if (!element) {
            alert("Primero abre el catálogo para generar el PDF.");
            return;
        }

        html2pdf().set({
            margin: 10,
            filename: "catalogo_equipos_medicos.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        }).from(element).save();
    };

    return (
        <div className="descargar-container">
            <h2>Catálogo en PDF</h2>
            <p>
                Genera el catálogo actualizado para enviarlo a tus clientes
                por correo o WhatsApp.
            </p>

            <button onClick={handleDownload} className="btn-descargar">
                Descargar catálogo PDF
            </button>
        </div>
    );
}


