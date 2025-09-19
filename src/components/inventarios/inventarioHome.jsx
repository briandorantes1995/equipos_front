import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#d0e6ff',
    ...theme.typography.body2,
    padding: theme.spacing(6),
    textAlign: 'center',
    color: '#1A1A1A',
    cursor: 'pointer',

    '&:hover': {
        backgroundColor: '#a6c8ff',
        color: '#0d3a75',
    }
}));

function InventarioHome() {
    return (
        <div className="main-content">
            <div className="container-fluid v">
                <h3 className="fw-bold my-4 pb-3">Operaciones Inventario</h3>
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <Stack spacing={4} sx={{width: '60%'}}>
                        <Link to="/inventarios/totales" style={{textDecoration: 'none'}}>
                            <Item>Inventario Total</Item>
                        </Link>
                        <Link to="/movimientos" style={{textDecoration: 'none'}}>
                            <Item>Movimientos</Item>
                        </Link>
                        <Link to="/categorias" style={{textDecoration: 'none'}}>
                            <Item>Agregar Categoria</Item>
                        </Link>
                        <Link to="/agregarArticulo" style={{textDecoration: 'none'}}>
                            <Item>Registrar Articulo</Item>
                        </Link>
                        <Item>Realizar Inventario</Item>
                    </Stack>
                </Box>
            </div>
        </div>
    );
}

export default InventarioHome;
