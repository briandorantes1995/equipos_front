import axios from "axios";

async function obtenerCompra(compraId, token) {
    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/compras/detalle`;

    try {
        const response = await axios.get(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                compra_id: compraId,
            },
        });
        return response.data;
    } catch (error) {
        console.error('No se pudo obtener el detalle de la compra:', error);
        throw error;
    }
}

export default obtenerCompra;
