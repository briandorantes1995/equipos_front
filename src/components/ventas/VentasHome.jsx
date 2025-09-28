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

function VentasHome() {
    return (
        <div className="main-content">
            <div className="container-fluid v">
                <h3 className="fw-bold my-4 pb-3">Operaciones Ventas</h3>
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <Stack spacing={4} sx={{width: '60%'}}>
                        <Link to="/ventas/totales" style={{textDecoration: 'none'}}>
                            <Item>Ventas Totales</Item>
                        </Link>
                        <Link to="/ventas/registro" style={{textDecoration: 'none'}}>
                            <Item>Registrar Ventas</Item>
                        </Link>
                    </Stack>
                </Box>
            </div>
        </div>
    );
}

export default VentasHome;