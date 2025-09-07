import * as React from 'react';
import { format } from 'date-fns';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import obtenerInventario from "../../Functions/obtenerInventario.js";
import AnadirMovimientoModal from "./anadirMovimientoModal.jsx";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import "./Inventarios.css";
import anadirMovimiento from "../../Functions/anadirMovimiento.js";
import {useNavigate} from "react-router-dom";

function InventarioTotal() {
    const [inventario, setInventario] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [articulo, setArticulo] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const token = useSelector(state => state.user.token);
    const navigate = useNavigate();

    const handleEdit = (articulo) => {
        setArticulo(articulo);
        setOpenModal(true);
    };

    const handleSave = async (nuevoMovimiento) => {
        console.log("Datos recibidos del modal:", nuevoMovimiento);
        try {
            const data = await anadirMovimiento(nuevoMovimiento, token);
            console.log("Movimiento registrado:", data);
            navigate('/inventarios/totales');
        } catch (error) {
            console.error("Error al registrar movimiento:", error);
        }
        setOpenModal(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await obtenerInventario(token);
                const rows = data.map(item => {
                    let fechaFormateada = null;
                    if (item.ultima_actualizacion && item.ultima_actualizacion !== "0001-01-01T00:00:00Z") {
                        try {
                            fechaFormateada = format(new Date(item.ultima_actualizacion), "dd/MM/yyyy");
                        } catch {
                            fechaFormateada = null;
                        }
                    }

                    return {
                        id: item.id,
                        nombre: item.nombre,
                        cantidad_actual: item.cantidad_actual,
                        precio: item.precio_venta,
                        costo: item.costo,
                        proveedor: item.proveedor,
                        codigo_barras: item.codigo_barras,
                        sku: item.sku,
                        ultima_actualizacion: fechaFormateada
                    };
                });

                setInventario(rows);
                setIsLoading(false);
            } catch (error) {
                console.error('Error al obtener el inventario:', error);
                setIsLoading(false);
            }
        }
        fetchData();
    }, [token]);

    const columns = [
        { field: 'nombre', headerName: 'Nombre', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'cantidad_actual', headerName: 'Cantidad', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'precio', headerName: 'Precio', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'costo', headerName: 'Costo', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'proveedor', headerName: 'Proveedor', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'codigo_barras', headerName: 'Codigo', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'sku', headerName: 'SKU', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        {field: 'ultima_actualizacion', headerName: 'Última actualización', width: 200, headerAlign: 'center', align: 'center',},
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Button variant="outlined" startIcon={<EditIcon/>}
                        onClick={() => handleEdit(params.row)}
                >
                </Button>
            ),
        },
    ];


    return (
        <div className="main-content">
            <div className="container-fluid v">
                <h3 className="fw-bold my-4 pb-3">Inventario Total</h3>
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <Paper sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={inventario}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            checkboxSelection
                            sx={{ border: 0 }}
                        />
                    </Paper>
                )}
                <AnadirMovimientoModal
                    open={openModal}
                    handleClose={() => setOpenModal(false)}
                    articulo={articulo}
                    onSubmit={handleSave}
                />
            </div>
        </div>
    );
}

export default InventarioTotal;








