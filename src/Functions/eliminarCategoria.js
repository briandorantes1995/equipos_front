import axios from "axios";

async function eliminarCategoria(id, token) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/categorias/eliminar/${id}`;

    try {
        const response = await axios.delete(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar categoría:', error.response?.data || error.message);
        throw error;
    }
}

export default eliminarCategoria;

