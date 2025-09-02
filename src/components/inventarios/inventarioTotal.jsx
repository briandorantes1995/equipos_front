import * as React from 'react';
import { format } from 'date-fns';
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
                console.log("Raw API data:", data);
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
        { field: 'id', headerName: 'ID', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'nombre', headerName: 'Nombre', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'cantidad_actual', headerName: 'Cantidad', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        {field: 'ultima_actualizacion', headerName: 'Última actualización', width: 200, headerAlign: 'center', align: 'center',
        }
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
            </div>
        </div>
    );
}

export default InventarioTotal;








