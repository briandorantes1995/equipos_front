import axios from "axios";

async function eliminarCompra(compra_id, token) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/compras/eliminar`;

    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { compra_id: Number(compra_id) }
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la compra:', error.response?.data || error.message);
        throw error;
    }
}

export default eliminarCompra;