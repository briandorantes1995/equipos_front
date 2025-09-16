import axios from "axios";

async function crearCategoria(categoriaData, token) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/categorias/agregar`;

    try {
        const response = await axios.post(baseURL, categoriaData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error(
            "Error al crear categoría:",
            error.response?.data || error.message
        );
        throw error;
    }
}

export default crearCategoria;
