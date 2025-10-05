import axios from "axios";

async function editarVenta(venta_id, data, token) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/ventas/editar`;

    try {
        const response = await axios.put(url, {
            venta_id,
            ...data,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error(
            "Error al editar la compra:",
            error.response?.data || error.message
        );
        throw error;
    }
}

export default editarVenta;