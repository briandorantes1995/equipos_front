import * as React from 'react';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "../../ui/snackBar/useSnackBar.js";
import AnadirCategoriaModal from "./AnadirCategoriaModal.jsx";
import obtenerCategorias from "../../Functions/obtenerCategorias.js";
import eliminarCategoria from "../../Functions/eliminarCategoria.js";
import actualizarCategoria from "../../Functions/actualizarCategoria.js";
import crearCategoria from "../../Functions/crearCategoria.js";
import Box from "@mui/material/Box";

function Categorias() {
    const [isLoading, setIsLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const token = useSelector(state => state.user.token);
    const { showSnackbar } = useSnackbar();

    // Cargar categorías
    useEffect(() => {
        async function fetchCategorias() {
            try {
                const data = await obtenerCategorias();
                setCategorias(data || []);
            } catch (error) {
                console.error("Error al obtener categorías:", error);
                setCategorias([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCategorias();
    }, [token]);

    const handleEdit = (categoria) => {
        setCategoria(categoria);
        setOpenModal(true);
    };

    const handleSave = async (categoriaData) => {
        try {
            let data;
            if (categoriaData.id) {
                // Editar
                data = await actualizarCategoria(categoriaData.id, categoriaData, token);
                setCategorias(prev =>
                    prev.map(cat => (cat.id === data.id ? data : cat))
                );
                showSnackbar({ message: "Categoría actualizada", level: "success", vertical: "top", horizontal: "center" });
            } else {
                // Crear
                data = await crearCategoria(categoriaData, token);
                setCategorias(prev => [...prev, data]);
                showSnackbar({ message: "Categoría creada", level: "success", vertical: "top", horizontal: "center" });
            }
        } catch (error) {
            console.error(error);
            showSnackbar({ message: "Error al guardar categoría", level: "error", vertical: "top", horizontal: "center" });
        } finally {
            setOpenModal(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta categoría?");
        if (!confirmDelete) return;
        try {
            await eliminarCategoria(id, token);
            setCategorias(prev => prev.filter(cat => cat.id !== id));
            showSnackbar({ message: "Categoría eliminada", level: "success", vertical: "top", horizontal: "center" });
        } catch (error) {
            console.error(error);
            showSnackbar({ message: "Error al eliminar categoría", level: "error", vertical: "top", horizontal: "center" });
        }
    };

    const columns = [
        { field: 'nombre', headerName: 'Nombre', width: 350, headerAlign: 'center', align: 'center' },
        { field: 'descripcion', headerName: 'Descripción', width: 400, headerAlign: 'center', align: 'center' },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 250,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(params.row)}
                    />
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(params.row.id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="main-content">
            <div className="container-fluid v">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <h3 className="fw-bold my-4 pb-3">Categorías</h3>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setCategoria(null); // Indica que es nueva categoría
                            setOpenModal(true);
                        }}
                    >
                        Añadir categoría
                    </Button>
                </Box>

                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <Paper sx={{ width: '100%', height: '100%' }}>
                        <DataGrid
                            rows={categorias}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25]}
                            sx={{ border: 0 }}
                        />
                    </Paper>
                )}

                <AnadirCategoriaModal
                    open={openModal}
                    handleClose={() => setOpenModal(false)}
                    categoria={categoria}
                    onSubmit={handleSave}
                />
            </div>
        </div>
    );
}

export default Categorias;


