import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";
import styled from "styled-components";
import { exportToPDF } from '../../utils/exportToPDF';
import obtenerVenta from "../../Functions/obtenerVenta.js";
import CardVentaDetalle from "./CardVenta.jsx";
import eliminarVenta from "../../Functions/eliminarVenta.js";


const StyledContainer = styled.div`
    width: 100%;
    max-width: 95vw;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 80px;
    min-height: 100vh;
    box-sizing: border-box;
`;

const StyledCardWrapper = styled.div`
    width: fit-content;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 16px;
    padding: 16px;
    background-color: rgb(223, 240, 255);
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

function Venta() {
    const token = useSelector(state => state.user.token);
    const [ventaDetalle, setVentaDetalle] = useState(null);
    const navigate = useNavigate();
    const { ventaId } = useParams();
    const rol = useSelector(state => state.user.rol);

    useEffect(() => {
        async function cargarVenta(id) {
            try {
                const data = await obtenerVenta(id, token);
                if (data.length > 0) {
                    const venta = {
                        venta_id: data[0].venta_id,
                        fecha: data[0].fecha,
                        notas: data[0].notas,
                        cliente_nombre: data[0].cliente_nombre,
                        cliente_correo: data[0].cliente_correo,
                        cliente_telefono: data[0].cliente_telefono,
                        cliente_razon_social: data[0].cliente_razon_social,
                        cliente_direccion: data[0].cliente_direccion,
                        monto_pagado:data[0].monto_pagado,
                        detalles: data.map(d => ({
                            detalle_id: d.detalle_id,
                            articulo_nombre: d.articulo_nombre,
                            articulo_marca: d.articulo_marca,
                            articulo_proveedor: d.articulo_proveedor,
                            cantidad: d.cantidad,
                            precio_unitario: d.precio_unitario,
                            subtotal: d.subtotal
                        }))
                    };
                    setVentaDetalle(venta);
                }
            } catch (error) {
                console.error('Error al obtener la venta:', error);
            }
        }

        cargarVenta(ventaId);
    }, [ventaId, token]);

    const borrarVenta = async () => {
        if (!window.confirm("¿Estás seguro de eliminar esta venta?")) return;
        try {
            const data = await eliminarVenta(ventaId, token);
            if (data) {
                navigate('/ventas/totales');
            }
        } catch (error) {
            console.error('No se pudo borrar la venta:', error);
        }
    };

    const editarVenta = () => {
        navigate(`/ventas/editar/${ventaId}`, { state: { venta: ventaDetalle } });
    };

    const descargarPDF = () => {
    if (ventaDetalle) {
        exportToPDF('venta-card', `Venta_${ventaDetalle.venta_id}.pdf`);
    }
};

    return (
        <div className="main-content">
            <div className="container-fluid">
                <h3 className="fw-bold my-4 pb-3">Detalle Venta</h3>
                <StyledContainer>
                    {ventaDetalle ? (
                        <StyledCardWrapper>
                            <CardVentaDetalle venta={ventaDetalle} />

                            {rol === "admin" && (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        color="secondary"
                                        onClick={descargarPDF}
                                        >
                                        Descargar PDF
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={editarVenta}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        color="error"
                                        onClick={borrarVenta}
                                    >
                                        Borrar
                                    </Button>
                                </div>
                            )}
                        </StyledCardWrapper>
                    ) : (
                        <LinearProgress />
                    )}
                </StyledContainer>
            </div>
        </div>
    );
}

export default Venta;
