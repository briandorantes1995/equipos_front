import axios from "axios";

async function obtenerTomasInventario(token) {
    const baseURL = import.meta.env.VITE_BACKEND_URL + `/api/inventario/obtener_tomas`;
    try {
        const response = await axios.get(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener las tomas fisicas:', error);
        throw error;
    }
}

export default obtenerTomasInventario;