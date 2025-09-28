import axios from "axios";

async function obtenerVenta(ventaId, token) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/ventas/detalle`;

    try {
        const response = await axios.get(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                venta_id: ventaId,
            },
        });
        return response.data;
    } catch (error) {
        console.error('No se pudo obtener el detalle de la compra:', error);
        throw error;
    }
}

export default obtenerVenta;