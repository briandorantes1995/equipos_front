import axios from "axios";

export async function descargarCatalogoPDF() {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/articulos/catalogo-pdf`,
    { responseType: "blob" }
  );

  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "catalogo_equipos_medicos.pdf";
  a.click();
  window.URL.revokeObjectURL(url);
}
