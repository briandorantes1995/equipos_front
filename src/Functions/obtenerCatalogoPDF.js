import axios from "axios";

export async function obtenerCatalogoPDF() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/articulos/catalogo-pdf`,
      { responseType: "blob" }
    );

    // si es PDF real
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "catalogo_equipos_medicos.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    // 🔑 mostrar el error real que viene del backend
    const blob = err?.response?.data;
    if (blob instanceof Blob) {
      const text = await blob.text();
      console.error("PDF ERROR REAL (backend/pdfshift):", text);
      alert(text); // para que lo veas sin abrir consola
      return;
    }
    console.error("Error descargando catálogo:", err);
    alert("Error descargando catálogo (revisa consola).");
  }
}
