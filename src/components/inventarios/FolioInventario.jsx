import * as React from 'react';
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Button, Box, LinearProgress, Typography } from '@mui/material';
import { useSnackbar } from "../../ui/snackBar/useSnackBar.js";
import obtenerDetalleInventario from '../../Functions/obtenerDetalleInventario.js';


function FolioInventario() {
    const { folio, categoria } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [detalle, setDetalle] = useState([]);
    const { showSnackbar } = useSnackbar();
    const token = useSelector(state => state.user.token);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDetalle() {
            try {
                const data = await obtenerDetalleInventario(token, folio);
                console.log(data)
                setDetalle(data.map(d => ({ ...d, id: d.articulo_id })));
            } catch (error) {
                console.error("Error al obtener detalle:", error);
                setDetalle([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDetalle();
    }, [folio, token]);

    const handleCellEdit = (params) => {
        setDetalle(prev =>
            prev.map(d => d.articulo_id === params.id ? { ...d, cantidad_real: Number(params.value) } : d)
        );
    };

    const handleGuardar = async () => {
        try {
            console.log("Guardar folio:", folio, detalle);
            showSnackbar({message: "Toma física guardada", level: "success", vertical: "top", horizontal: "center"});
            navigate('/inventarios');
        } catch (error) {
            console.error(error);
            showSnackbar({message: "Error al guardar", level: "error", vertical: "top", horizontal: "center"});
        }
    };

    const columns = [
        { field: 'nombre', headerName: 'Artículo', width: 300 },
        { field: 'proveedor', headerName: 'Proveedor', width: 150 },
        { field: 'marca', headerName: 'Marca', width: 130 },
        { field: 'codigo_barras', headerName: 'Código', width: 150 },
        { field: 'cantidad_teorica', headerName: 'Cantidad Teórica', width: 150 },
        { field: 'cantidad_real', headerName: 'Cantidad Real', width: 150, editable: true },
    ];

    return (
        <div className="main-content">
            <div className="container-fluid">
                <Box mb={2}>
                    <Typography variant="h6">Folio: {folio}</Typography>
                    <Typography variant="subtitle1">Categoría: {categoria || "Todas"}</Typography>
                </Box>

                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Paper sx={{ width: '100%', height: 500, mb: 2 }}>
                            <DataGrid
                                rows={detalle}
                                columns={columns}
                                pageSizeOptions={[10, 25, 50]}
                                onCellEditCommit={handleCellEdit}
                            />
                        </Paper>

                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button variant="contained" color="error" onClick={() => navigate('/inventarios')}>
                                Cancelar
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleGuardar}>
                                Guardar Toma Física
                            </Button>
                        </Box>
                    </>
                )}
            </div>
        </div>
    );
}

export default FolioInventario;



