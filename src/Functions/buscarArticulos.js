import axios from "axios";

async function buscarArticulos(termino) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/articulos/buscar`;

    try {
        const response = await axios.get(baseURL, {
            params: { busqueda: termino }
        });
        return response.data;
    } catch (error) {
        console.error('No se pudo buscar los artículos:', error);
        throw error;
    }
}

export default buscarArticulos;

