import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import obtenerCategorias from "../../Functions/obtenerCategorias.js";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

function NuevoInventarioModal({ open, handleClose, onSubmit }) {
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    useEffect(() => {
        async function fetchCategorias() {
            const data = await obtenerCategorias();
            setCategorias(data || []);
        }
        fetchCategorias();
    }, []);

    const handleGuardar = () => {
        onSubmit({ categoria_id: categoriaSeleccionada || null });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Nuevo Inventario
                </Typography>

                <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                        value={categoriaSeleccionada}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        {categorias.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleGuardar}>
                        Crear
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default NuevoInventarioModal;
