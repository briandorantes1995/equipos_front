import * as React from 'react';
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Button, Box, LinearProgress, Typography } from '@mui/material';
import { useSnackbar } from "../../ui/snackBar/useSnackBar.js";
import obtenerDetalleInventario from '../../Functions/obtenerDetalleInventario.js';
import cancelarToma from "../../Functions/cancelarToma.js";
import guardarToma from "../../Functions/guardarToma.js";
import finalizarToma from "../../Functions/finalizarToma.js";

function FolioInventario() {
    const { folio, categoria, estado } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [detalle, setDetalle] = useState([]);
    const { showSnackbar } = useSnackbar();
    const token = useSelector(state => state.user.token);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDetalle() {
            try {
                const data = await obtenerDetalleInventario(token, folio);
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

    const handleProcessRowUpdate = (newRow) => {
        setDetalle(prevDetalle =>
            prevDetalle.map(row => (row.id === newRow.id ? newRow : row))
        );
        return newRow;
    };

    const handleTerminar = async () => {
        if (!window.confirm("¿Estás seguro de finalizar la toma física? Una vez finalizada, no se podrá editar.")) {
            return;
        }

        try {
            const datosParaFinalizar = detalle.map(({ detalle_id, cantidad_real }) => ({
                detalle_id,
                cantidad_real: Number(cantidad_real) || 0
            }));

            // 1. Llama a la nueva función de la API
            await finalizarToma(datosParaFinalizar, token);

            showSnackbar({ message: "Toma física finalizada con éxito", level: "success", vertical: "top", horizontal: "center" });

            navigate('/inventarios/tomas');

        } catch (error) {
            console.error("Error al finalizar la toma:", error);
            showSnackbar({ message: "Error al finalizar", level: "error", vertical: "top", horizontal: "center" });
        }
    };

    const handleGuardar = async () => {
        try {
            const datosParaGuardar = detalle.map(({ detalle_id, cantidad_real }) => ({
                detalle_id,
                cantidad_real: Number(cantidad_real) || 0
            }));
            await guardarToma(datosParaGuardar,token);
            showSnackbar({ message: "Toma física guardada", level: "success", vertical: "top", horizontal: "center" });
        } catch (error) {
            console.error(error);
            showSnackbar({ message: "Error al guardar", level: "error", vertical: "top", horizontal: "center" });
        }
    };

    const handleCancelar = async () => {
        if (!window.confirm("¿Estás seguro de cancelar el folio? se perderan todos los datos...?")) return;
        try {
            if (detalle.length > 0) {
                const id_folio = detalle[0].toma_id;
                await cancelarToma(id_folio,token)
                showSnackbar({ message: "Toma física cancelada", level: "success", vertical: "top", horizontal: "center" });
                navigate('/inventarios/tomas');
            } else {
                showSnackbar({ message: "No hay detalles para cancelar", level: "warning", vertical: "top", horizontal: "center" });
            }
        } catch (error) {
            console.error(error);
            showSnackbar({ message: "Error al cancelar", level: "error", vertical: "top", horizontal: "center" });
        }
    };

  // Definimos columnas base
  const baseColumns = [
    { field: 'nombre', headerName: 'Artículo', width: 300 },
    { field: 'proveedor', headerName: 'Proveedor', width: 150 },
    { field: 'marca', headerName: 'Marca', width: 130 },
    { field: 'codigo_barras', headerName: 'Código', width: 150 },
    { field: 'cantidad_teorica', headerName: 'Cantidad Teórica', type: 'number', width: 150 },
    {
      field: 'cantidad_real',
      headerName: 'Cantidad Real',
      type: 'number',
      width: 150,
      editable: estado === "abierta",
    },
  ];

  // Si es cerrada, se agregar la columna de diferencia
  const columns =
    estado === "cerrada"
      ? [
          ...baseColumns,
          {
            field: 'diferencia',
            headerName: 'Diferencia',
            type: 'number',
            width: 150,
          },
        ]
      : baseColumns;

  // Calcular total de diferencias
  const totalDiferencia = estado === "cerrada"
    ? detalle.reduce((acc, d) => acc + (Number(d.diferencia) || 0), 0)
    : 0;


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
                                processRowUpdate={estado === "abierta" ? handleProcessRowUpdate : undefined}
                            />
                        </Paper>

                            {estado === "cerrada" && (
                            <Box mt={2} display="flex" justifyContent="flex-end">
                                <Typography variant="subtitle1" fontWeight="bold">
                                Diferencia total de piezas: {totalDiferencia}
                                </Typography>
                            </Box>
                            )}

                        {estado === "abierta" && (
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button variant="contained" color="error" onClick={handleCancelar}>
                            Cancelar Toma Fisica
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleGuardar}>
                            Guardar Toma Física
                            </Button>
                            <Button variant="contained" color="success" onClick={handleTerminar}>
                            Finalizar Toma Física
                            </Button>
                        </Box>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default FolioInventario;



