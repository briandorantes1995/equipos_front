import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";
import styled from "styled-components";
import obtenerCompra from "../../Functions/obtenerCompra.js";
import CardCompraDetalle from "./cardCompra.jsx";
import eliminarCompra from "../../Functions/eliminarCompra.js";

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

function Compra() {
    const token = useSelector(state => state.user.token);
    const [compraDetalle, setCompraDetalle] = useState(null);
    const navigate = useNavigate();
    const { compraId } = useParams();
    const rol = useSelector(state => state.user.rol);

    useEffect(() => {
        async function cargarCompra(id) {
            try {
                const data = await obtenerCompra(id, token);
                if (data.length > 0) {
                    const compra = {
                        compra_id: data[0].compra_id,
                        fecha: data[0].fecha,
                        notas: data[0].notas,
                        detalles: data.map(d => ({
                            detalle_id: d.detalle_id,
                            articulo_nombre: d.articulo_nombre,
                            articulo_proveedor: d.articulo_proveedor,
                            cantidad: d.cantidad,
                            precio_unitario: d.precio_unitario,
                            subtotal: d.subtotal
                        }))
                    };
                    setCompraDetalle(compra);
                }
            } catch (error) {
                console.error('Error al obtener la compra:', error);
            }
        }

        cargarCompra(compraId);
    }, [compraId, token]);

    const borrarCompra = async () => {
        if (!window.confirm("¿Estás seguro de eliminar esta compra?")) return;
        try {
            const data = await eliminarCompra(compraId,token);
            if (data) {
                navigate('/compras/totales');
            }
        } catch (error) {
            console.error('No se pudo borrar la compra:', error);
        }
    };

    const editarCompra = () => {
        navigate(`/compras/editar/${compraId}`, { state: { compra: compraDetalle } });
    };

    return (
        <div className="main-content">
            <div className="container-fluid v">
                <h3 className="fw-bold my-4 pb-3">Detalle Compra</h3>
        <StyledContainer>
            {compraDetalle ? (
                <StyledCardWrapper>
                    <CardCompraDetalle compra={compraDetalle} />

                    {rol === "admin" && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={editarCompra}
                            >
                                Editar
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                color="error"
                                onClick={borrarCompra}
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

export default Compra;
