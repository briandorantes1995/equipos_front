import axios from "axios";

async function editarCompra(compra_id, data, token) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/compras/editar`;

    try {
        const response = await axios.put(url, {
            compra_id,
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

export default editarCompra;
