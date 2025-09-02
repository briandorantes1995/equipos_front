import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import "./Inventarios.css";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#d0e6ff', // fondo principal equilibrado
    ...theme.typography.body2,
    padding: theme.spacing(6),
    textAlign: 'center',
    color: '#1A1A1A', // texto sobre fondo claro
    cursor: 'pointer',

    '&:hover': {
        backgroundColor: '#a6c8ff', // hover equilibrado
        color: '#0d3a75', // texto sobre hover
    }
}));

function InventarioHome() {
    return (
        <div className="main-content">
            <div className="container-fluid v">
                <Box sx={{ width: '100%' ,display: 'flex', justifyContent: 'center' }}>
                    <Stack spacing={4} sx={{ width: '60%' }}>
                        <Link to="/inventarios/totales" style={{ textDecoration: 'none' }}>
                            <Item>Inventario Total</Item>
                        </Link>
                        <Link to="/movimientos" style={{ textDecoration: 'none' }}>
                            <Item>Movimientos</Item>
                        </Link>
                        <Item>Actualizar/Editar</Item>
                        <Item>Registrar Movimiento</Item>
                    </Stack>
                </Box>
            </div>
        </div>
    );
}

export default InventarioHome;
