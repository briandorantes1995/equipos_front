import axios from "axios";

export async function obtenerCatalogoPDF() {
  const url = `${import.meta.env.VITE_BACKEND_URL}/api/articulos/catalogo-pdf`;
  try{
  const response = await axios.get(url, {
    responseType: "blob", // 🔑 CLAVE
  });
  }catch (error) {
  if (error.response?.data instanceof Blob) {
    const text = await error.response.data.text();
    console.error("PDF error real:", text);
  } else {
    console.error(error);
  }
}

  return response.data; // Blob PDF
}
