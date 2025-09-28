import axios from "axios";

async function eliminarVenta(venta_id, token) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/ventas/eliminar`;

    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { venta_id: Number(venta_id) }
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar venta:', error.response?.data || error.message);
        throw error;
    }
}

export default eliminarVenta;