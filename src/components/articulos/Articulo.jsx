import React, { useEffect, useState } from 'react';
import obtenerArticulo from "../../functions/obtenerArticulo.js";
import eliminarArticulo from "../../functions/eliminarArticulo.js";
import BasicCard from './Card.jsx'
import { useNavigate, useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";
import styled from "styled-components";



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

    async function borrar() {
        try {
            await eliminarArticulo(articuloId, token);
            navigate('/articulos');
        } catch (error) {
            console.error('No se pudo borrar el artículo:', error);
        }
    }

    function editar() {
        navigate(`/editarArticulo/${articuloId}`);
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
                    <BasicCard articulo={mostrarArticulo}/>

                    {rol === "admin" && (
                        <>
                            <Button
                                variant="contained"
                                size="large"
                                className="btn-v"
                                onClick={editar}
                            >
                                Editar
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                className="btn-v"
                                color="error"
                                onClick={borrar}
                            >
                                Borrar
                            </Button>
                        </>
                    )}
                </StyledCard>
            ) : (
                <LinearProgress/>
            )}
        </div>
    );
}

export default Articulo;
