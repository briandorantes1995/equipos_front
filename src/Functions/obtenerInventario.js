import axios from "axios";

async function obtenerInventario(token) {
    const baseURL = import.meta.env.VITE_BACKEND_URL + `/api/inventario`; // endpoint de inventario
    try {
        const response = await axios.get(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener inventario actual:', error);
        throw error;
    }
}

export default obtenerInventario;
