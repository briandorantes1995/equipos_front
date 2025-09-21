import axios from "axios";

async function obtenerDetalleInventario(token,id) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/inventario/detalles_tomas/${id}`;

    try {
        const response = await axios.get(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error el folio de inventario:', error);
        throw error;
    }
}

export default obtenerDetalleInventario;