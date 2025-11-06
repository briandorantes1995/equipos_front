import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice.jsx";
import styled from "styled-components";
import inactivarArticulo from "../../Functions/inactivarArticulo.js";
import LinearProgress from "@mui/material/LinearProgress";
import obtenerArticulo from "../../Functions/obtenerArticulo.js";
import BasicCard from './Card.jsx';

const StyledCard = styled.div`
    width: fit-content;
    max-width: 90vw;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 80px;
    padding: 16px;
    background-color: rgb(223, 240, 255);
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

function Articulo() {
    const token = useSelector(state => state.user.token);
    const [mostrarArticulo, setMostrarArticulo] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { articuloId } = useParams();
    const rol = useSelector(state => state.user.rol);

    useEffect(() => {
        async function cargarArticulo(id) {
            try {
                const data = await obtenerArticulo(id);
                setMostrarArticulo(data);
            } catch (error) {
                console.error('Error al obtener el artículo:', error);
            }
        }

        cargarArticulo(articuloId);
    }, [articuloId]);

    // Función toggle: activa o inactiva el artículo
    async function toggleEstado() {
        if (!mostrarArticulo) return;

        try {
            const nuevoEstado = mostrarArticulo.estado === "activo" ? "inactivo" : "activo";

            await inactivarArticulo(mostrarArticulo, nuevoEstado, token);

            setMostrarArticulo({ ...mostrarArticulo, estado: nuevoEstado });
        } catch (error) {
            console.error('No se pudo cambiar el estado del artículo:', error);
        }
    }


    function editar() {
        navigate(`/editarArticulo/${articuloId}`);
    }

    function agregarAlCarrito() {
        if (!mostrarArticulo) return;
        dispatch(addItem({
            id: mostrarArticulo.id,
            imagen: mostrarArticulo.imagen,
            nombre: mostrarArticulo.nombre,
            descripcion: mostrarArticulo.descripcion,
            precio: mostrarArticulo.precio_venta,
            cantidad: 1,
            ...(mostrarArticulo.marca && { marca: mostrarArticulo.marca })
        }));
    }

    return (
        <div
            className="container-fluid v"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: '80px',
                minHeight: '100vh',
                boxSizing: 'border-box',
            }}
        >
            {mostrarArticulo ? (
                <StyledCard>
                    <BasicCard articulo={mostrarArticulo} />

                    {rol === "admin" ? (
                        <>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={editar}
                            >
                                Editar
                            </Button>

                            <Button
                                variant="contained"
                                size="large"
                                color={mostrarArticulo.estado === "activo" ? "error" : "success"}
                                onClick={toggleEstado}
                            >
                                {mostrarArticulo.estado === "activo" ? "Inactivar" : "Activar"}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={agregarAlCarrito}
                        >
                            Agregar al carrito
                        </Button>
                    )}
                </StyledCard>
            ) : (
                <LinearProgress />
            )}
        </div>
    );
}

export default Articulo;

