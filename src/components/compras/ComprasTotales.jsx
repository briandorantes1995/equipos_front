import * as React from 'react';
import { format } from 'date-fns';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import obtenerCompras from "../../Functions/obtenerCompras.js";

function ComprasTotales() {
    const [compras, setCompras] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = useSelector(state => state.user.token);
    const navigate = useNavigate();

    const handleDetalle = (compra) => {
        navigate(`/compras/${compra.id}`);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await obtenerCompras(token);
                const rows = data.map(item => {
                    let fechaFormateada = null;
                    if (item.fecha && item.fecha !== "0001-01-01T00:00:00Z") {
                        try {
                            fechaFormateada = format(new Date(item.fecha), "dd/MM/yyyy");
                        } catch {
                            fechaFormateada = null;
                        }
                    }

                    return {
                        id: item.compra_id,
                        articulos_totales: item.articulos_totales,
                        total_precio: item.total_precio,
                        notas: item.notas,
                        fecha: fechaFormateada
                    };
                });

                setCompras(rows);
                setIsLoading(false);
            } catch (error) {
                console.error('Error al obtener las compras:', error);
                setIsLoading(false);
            }
        }
        fetchData();
    }, [token]);

    const columns = [
        { field: 'fecha', headerName: 'Fecha', width: 120, headerAlign: 'center', align: 'center' },
        { field: 'articulos_totales', headerName: 'Total Artículos', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'total_precio', headerName: 'Costo Total', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'notas', headerName: 'Notas', width: 200, headerAlign: 'center', align: 'center' },
        {
            field: 'acciones',
            headerName: 'Detalle',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Button variant="outlined" startIcon={<EditIcon />}
                        onClick={() => handleDetalle(params.row)}
                >
                    Ver
                </Button>
            ),
        },
    ];

    return (
        <div className="main-content">
            <div className="container-fluid v">
                <h3 className="fw-bold my-4 pb-3">Compras Totales</h3>
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <Paper sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={compras}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            sx={{ border: 0 }}
                        />
                    </Paper>
                )}
            </div>
        </div>
    );
}

export default ComprasTotales;
