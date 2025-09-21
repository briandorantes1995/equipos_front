import axios from "axios";

export async function crearTomaInventario(categoriaId = null,token) {
    const payload = {
        categoria_id: categoriaId ? categoriaId.categoria_id : null
    };

    try {
        const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + "/api/inventario/crear_tomas",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error creando toma de inventario:", error);
        throw error;
    }
}
