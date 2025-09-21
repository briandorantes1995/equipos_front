import * as React from 'react';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useSnackbar } from "../../ui/snackBar/useSnackBar.js";
import NuevoInventarioModal from "./NuevoInventarioModal.jsx";
import obtenerTomasInventario from "../../Functions/obtenerTomasInventario.js";
import {crearTomaInventario} from "../../Functions/crearTomaInventario.jsx";
import {format, parseISO} from "date-fns";

function TomaFisica() {
    const [isLoading, setIsLoading] = useState(true);
    const [inventarios, setInventarios] = useState([]);
    const [tab, setTab] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const token = useSelector(state => state.user.token);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();


    async function fetchInventarios() {
        try {
            const data = await obtenerTomasInventario(token);
            const rows = (data || []).map(item => {
                const formatDate = (dateStr) => {
                    if (!dateStr || dateStr === "0001-01-01T00:00:00Z") return null;
                    try {
                        const isoString = dateStr.split(".")[0];
                        return format(parseISO(isoString), "dd/MM/yyyy");
                    } catch {
                        return null;
                    }
                };

                return {
                    id: item.folio,
                    folio: item.folio,
                    fecha_inicio: formatDate(item.fecha_inicio),
                    fecha_fin: formatDate(item.fecha_fin),
                    categoria_nombre: item.categoria_nombre || "Todas",
                    estado: item.estado,
                    usuario_correo: item.usuario_correo || "Sin Auditor"
                };
            });
            setInventarios(rows || []);
        } catch (error) {
            console.error("Error al obtener inventarios:", error);
            setInventarios([]);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchInventarios();
    }, [token]);

    const handleNuevoInventario = () => setOpenModal(true);

    const handleGuardarInventario = async (inventarioData) => {
        try {
            const nuevaToma = await crearTomaInventario(inventarioData,token);
            showSnackbar({ message: `Toma creada con folio ${nuevaToma.folio}`, level: "success",horizontal: "center" });
            setOpenModal(false);
            await fetchInventarios();
        } catch (error) {
            console.log(error)
            showSnackbar({ message: "Error al crear la toma", level: "error" });
        }
    };

    const handleTabChange = (event, newValue) => setTab(newValue);

    const columns = [
        { field: 'folio', headerName: 'Folio', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'fecha_inicio', headerName: 'Fecha Inicio', width: 180, headerAlign: 'center', align: 'center' },
        { field: 'fecha_fin', headerName: 'Fecha Fin', width: 180, headerAlign: 'center', align: 'center'},
        { field: 'categoria_nombre', headerName: 'Categoría', width: 250, headerAlign: 'center', align: 'center' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', align: 'center' },
        { field: 'usuario_correo', headerName: 'Auditor', width: 220, headerAlign: 'center', align: 'center' }
    ];


    const inventariosFiltrados = inventarios.filter(inv =>
        tab === 0 ? inv.estado === 'abierta' : inv.estado === 'cerrada'
    );

    return (
        <div className="main-content">
            <div className="container-fluid">
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNuevoInventario}
                    sx={{ mb: 2 }}
                >
                    Nuevo Inventario
                </Button>

                <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab label="Activos" />
                    <Tab label="Finalizados" />
                </Tabs>

                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <Paper sx={{ width: '100%', height: '100%' }}>
                        <DataGrid
                            rows={inventariosFiltrados}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25]}
                            sx={{ border: 0 }}
                            onRowClick={(params) =>
                                navigate(`/inventarios/tomas/${params.row.folio}/${params.row.categoria_nombre || 'todas'}`)
                            }

                        />
                    </Paper>
                )}

                <NuevoInventarioModal
                    open={openModal}
                    handleClose={() => setOpenModal(false)}
                    onSubmit={handleGuardarInventario}
                />
            </div>
        </div>
    );
}

export default TomaFisica;
