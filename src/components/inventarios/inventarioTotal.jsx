import { format } from 'date-fns';
import { useEffect, useState,useCallback } from "react";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import obtenerInventario from "../../Functions/obtenerInventario.js";
import AnadirMovimientoModal from "./AnadirMovimientoModal.jsx";
import CambiarEstadoModal from "./CambiarEstadoModal.jsx";
import anadirMovimiento from "../../Functions/anadirMovimiento.js";
import inactivarArticulo from "../../Functions/inactivarArticulo.js";
import { DataGrid } from '@mui/x-data-grid';
import {useSnackbar} from "../../ui/snackBar/useSnackBar.js";
import Paper from '@mui/material/Paper';
import EditIcon from "@mui/icons-material/Edit";
import {Typography,Button,Box,} from "@mui/material";



function InventarioTotal() {
    const [inventario, setInventario] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [articulo, setArticulo] = useState(null);
    const [openEstadoModal, setOpenEstadoModal] = useState(false);
    const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const token = useSelector(state => state.user.token);
    const { showSnackbar } = useSnackbar();

    const handleEdit = async (articulo) => {
            setArticulo(articulo);
            setOpenModal(true);
    };

    const handleEstadoClick = (articulo) => {
        setArticuloSeleccionado(articulo);
        setOpenEstadoModal(true);
    };

    const handleCambiarEstado = async (nuevoEstado) => {
        if (!articuloSeleccionado) return;
        try {
            await inactivarArticulo(articuloSeleccionado, nuevoEstado, token);
            await fetchData(); // recarga inventario
            showSnackbar({message: `Estado de ${articuloSeleccionado.nombre} actualizado a ${nuevoEstado}`, level: "success", vertical: "top", horizontal: "center",});
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            showSnackbar({message: "Error al cambiar estado", level: "error", vertical: "top", horizontal: "center",});
        } finally {
            setOpenEstadoModal(false);
            setArticuloSeleccionado(null);
        }
    };


    const handleSave = async (nuevoMovimiento) => {
        try {
            const data = await anadirMovimiento(nuevoMovimiento, token);
            await fetchData();
            showSnackbar({message: data.message || "Movimiento Agregado", level: "success", vertical: "top", horizontal: "center",});
        } catch (error) {
            console.error("Error al registrar movimiento:", error);
            showSnackbar({message: "Error al agregar movimiento", level: "error", vertical: "top", horizontal: "center",});
        }
        setOpenModal(false);
    };
 const fetchData = useCallback(async () => {
        setIsLoading(true);
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
                    inventario_costo: Math.round(item.costo * item.cantidad_actual),
                    codigo_barras: item.codigo_barras,
                    ultima_actualizacion: fechaFormateada,
                    marca: item.marca ? item.marca : 'Sin Marca',
                    estado:item.estado
                };
            });
            setInventario(rows);
        } catch (error) {
            console.error('Error al obtener el inventario:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

     const totalInventario = inventario.reduce(
        (acc, item) => acc + item.inventario_costo,
        0
    );

    const columns = [
        { field: 'nombre', headerName: 'Nombre', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'codigo_barras', headerName: 'Codigo', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'proveedor', headerName: 'Proveedor', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'marca', headerName: 'Marca', width: 130, headerAlign: 'center', align: 'center' },
        {
            field: 'estado',
            headerName: 'Estado',
            width: 130,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color={params.value === "activo" ? "success" : "error"}
                    onClick={() => handleEstadoClick(params.row)}
                >
                    {params.value === "activo" ? "Activo" : "Inactivo"}
                </Button>
            ),
        },
         { field: 'cantidad_actual', headerName: 'Cantidad', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'precio', headerName: 'Precio Venta', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
        { field: 'costo', headerName: 'Costo', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
         { field: 'inventario_costo', headerName: 'Inventario_Costo', type: 'number', width: 130, headerAlign: 'center', align: 'center' },
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
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Valor Total del Inventario: $
                                {inventario.length > 0
                                    ? totalInventario.toLocaleString()
                                    : 0}
                            </Typography>
                        </Box>

                        <Paper sx={{ height: '100%', width: '100%' }}>
                            <DataGrid
                                rows={inventario}
                                columns={columns}
                                pageSizeOptions={[5, 10, 25, 50, 100]}
                                sx={{ border: 0 }}
                            />
                        </Paper>
                    </>
                )}
                <AnadirMovimientoModal
                    open={openModal}
                    handleClose={() => setOpenModal(false)}
                    articulo={articulo}
                    onSubmit={handleSave}
                />
                <CambiarEstadoModal
                    open={openEstadoModal}
                    handleClose={() => setOpenEstadoModal(false)}
                    articulo={articuloSeleccionado}
                    onSubmit={handleCambiarEstado}
                />
            </div>
        </div>
    );
}

export default InventarioTotal;








