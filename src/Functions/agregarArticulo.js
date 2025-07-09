import axios from "axios";

async function agregarArticulo(datos, token) {
    const baseURL = import.meta.env.VITE_BACKEND_URL+`/api/articulos/agregar`;
    console.log(JSON.stringify(datos))

    try {
        const response = await axios.post(baseURL, datos, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al agregar artículo:', error);
        throw error;
    }
}

export default agregarArticulo;

