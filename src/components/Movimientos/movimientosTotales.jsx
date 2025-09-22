import * as React from 'react';
import { format } from 'date-fns';
import { useEffect, useState,useCallback } from "react";
import { useSelector } from "react-redux";
import obtenerMovimientos from "../../Functions/obtenerMovimientos.js";
import editarMovimiento from "../../Functions/editarMovimiento.js";
import EditarMovimientoModal from "./edicionMovimientoModal.jsx";
import eliminarMovimiento from "../../Functions/eliminarMovimiento.js";
import {capitalizeName} from "../../Functions/helpers.jsx";
import { DataGrid } from '@mui/x-data-grid';
import LinearProgress from "@mui/material/LinearProgress";
import EditIcon from '@mui/icons-material/Edit';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {useSnackbar} from "../../ui/snackBar/useSnackBar.js";



function MovimientoTotal() {
    const [movimientos, setMovimientos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMovimiento, setSelectedMovimiento] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const token = useSelector(state => state.user.token);
    const { showSnackbar } = useSnackbar();

    const handleEdit = (movimiento) => {
        setSelectedMovimiento(movimiento);
        setOpenModal(true);
    };

    const handleSave = async (movimientoEditado) => {
        if (movimientoEditado._action === "update") {
            try {
                const data = await editarMovimiento(movimientoEditado, token);
                if (data) {
                    await fetchData();
                    showSnackbar({message:"Movimiento actualizado con éxito", level: "success", vertical: "top", horizontal: "center",});
                }
            } catch (error) {
                console.error('Error al actualizar movimiento:', error);
                showSnackbar({message: "Error al actualizar el movimiento", level: "error", vertical: "top", horizontal: "center",});
            }
        } else if (movimientoEditado._action === "delete") {
            try {
                const data = await eliminarMovimiento(movimientoEditado.id, token);
                if (data) {
                    await fetchData();
                    showSnackbar({message: data.message || "Movimiento eliminado con exito", level: "success", vertical: "top", horizontal: "center",});
                }
            } catch (error) {
                console.error('Error al eliminar movimiento:', error);
                showSnackbar({message: "Error al eliminar el movimiento", level: "error", vertical: "top", horizontal: "center",});
            }
        }
        setOpenModal(false);
    };


   const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await obtenerMovimientos(token);
            const rows = data.map(item => {
                let fechaFormateada = null;
                let nombreUsuario = "Usuario sin información";

                if (item.fecha && item.fecha !== "0001-01-01T00:00:00Z") {
                    try {
                        fechaFormateada = format(new Date(item.fecha), "dd/MM/yyyy");
                    } catch {
                        fechaFormateada = null;
                    }
                }

                if (item.usuario_nombre && item.usuario_nombre.trim() !== "" && item.usuario_nombre !== "0") {
                    try {
                        nombreUsuario = capitalizeName(item.usuario_nombre);
                    } catch {
                        nombreUsuario = "Usuario sin Información";
                    }
                }

                return {
                    id: item.id,
                    nombre: item.nombre_articulo,
                    proveedor: item.proveedor_articulo,
                    tipo_movimiento: item.tipo_movimiento,
                    cantidad: item.cantidad,
                    motivo: item.motivo,
                    fecha: fechaFormateada,
                    usuario: nombreUsuario,
                };
            });

            setMovimientos(rows);
        } catch (error) {
            console.error('Error al obtener los movimientos:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = [
        { field: 'nombre', headerName: 'Nombre', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'proveedor', headerName: 'Proveedor', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'tipo_movimiento', headerName: 'Tipo de movimiento', width: 180, headerAlign: 'center', align: 'center' },
        { field: 'cantidad', headerName: 'Cantidad', type: 'number', width: 120, headerAlign: 'center', align: 'center' },
        { field: 'motivo', headerName: 'Motivo', width: 250, headerAlign: 'center', align: 'center' },
        { field: 'fecha', headerName: 'Fecha', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'usuario', headerName: 'Usuario', width: 200, headerAlign: 'center', align: 'center' },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const tipo = params.row.tipo_movimiento;
                if (tipo === "venta" || tipo === "compra") {
                    return null;
                }
                return (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(params.row)}
                    >
                    </Button>
                );
            },
        },
    ];

    return (
        <div className="main-content">
            <div className="container-fluid v">
                <h3 className="fw-bold my-4 pb-3">Movimientos de Inventario</h3>
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <Paper sx={{ height: '100%', width: '100%' }}>
                        <DataGrid
                            rows={movimientos}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            checkboxSelection
                            sx={{ border: 0 }}
                        />
                    </Paper>
                )}
                <EditarMovimientoModal
                    open={openModal}
                    handleClose={() => setOpenModal(false)}
                    movimiento={selectedMovimiento}
                    onSubmit={handleSave}
                />
            </div>
        </div>
    );
}

export default MovimientoTotal;