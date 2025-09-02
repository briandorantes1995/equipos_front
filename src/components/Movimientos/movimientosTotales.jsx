import * as React from 'react';
import { format } from 'date-fns';
import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import obtenerMovimientos from "../../Functions/obtenerMovimientos.js";
import { useSelector } from "react-redux";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import "../inventarios/Inventarios.css";
import {capitalizeName} from "../../Functions/helpers.jsx";

function MovimientoTotal() {
    const [movimientos, setMovimientos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = useSelector(state => state.user.token);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await obtenerMovimientos(token);
                console.log("Raw API data:", data);
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
                        id: item.articulo_id,
                        nombre: item.nombre_articulo,
                        tipo_movimiento: item.tipo_movimiento,
                        cantidad: item.cantidad,
                        motivo: item.motivo,
                        fecha: fechaFormateada,
                        usuario: nombreUsuario,
                    };
                });

                setMovimientos(rows);
                console.log(movimientos);
                setIsLoading(false);
            } catch (error) {
                console.error('Error al obtener el inventario:', error);
                setIsLoading(false);
            }
        }
        fetchData();
    }, [token]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'nombre', headerName: 'Nombre', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'tipo_movimiento', headerName: 'Tipo de movimiento', width: 180, headerAlign: 'center', align: 'center' },
        { field: 'cantidad', headerName: 'Cantidad', type: 'number', width: 120, headerAlign: 'center', align: 'center' },
        { field: 'motivo', headerName: 'Motivo', width: 250, headerAlign: 'center', align: 'center' },
        { field: 'fecha', headerName: 'Fecha', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'usuario', headerName: 'Usuario', width: 250, headerAlign: 'center', align: 'center' },
    ];



    return (
        <div className="main-content">
            <div className="container-fluid v">
                <h3 className="fw-bold my-4 pb-3">Movimientos de Inventario</h3>
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <Paper sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={movimientos}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            checkboxSelection
                            sx={{ border: 0 }}
                        />
                    </Paper>
                )}
            </div>
        </div>
    );
}

export default MovimientoTotal;