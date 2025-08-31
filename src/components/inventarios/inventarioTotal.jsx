import * as React from 'react';
import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import obtenerInventario from "../../Functions/obtenerInventario.js";
import { useSelector } from "react-redux";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import "./Inventarios.css";

function InventarioTotal() {
    const [inventario, setInventario] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = useSelector(state => state.user.token);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await obtenerInventario(token);
                // Mapeamos los datos para DataGrid
                const rows = data.map(item => ({
                    id: item.id,
                    nombre: item.nombre,
                    cantidad_actual: item.cantidad_actual,
                }));
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
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'nombre', headerName: 'Nombre', width: 200 },
        { field: 'cantidad_actual', headerName: 'Cantidad', type: 'number', width: 130 },
    ];

    return (
        <div className="main-content">
            <div className="container-fluid v">
                <h3 className="fw-bold my-4 pb-3">Inventario Total</h3>
                {isLoading ? (
                    <LinearProgress/>
                ) : (
                    <Paper sx={{height: 400, width: '100%'}}>
                        <DataGrid
                            rows={inventario} // aquí usamos los datos reales
                            columns={columns}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            sx={{border: 0}}
                        />
                    </Paper>
                )}
            </div>
        </div>
    );
}

export default InventarioTotal;
