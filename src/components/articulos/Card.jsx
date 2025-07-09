import React from 'react';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';

const StyledCard = styled.div`
  min-width: 60%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: aliceblue;
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const Image = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`;

const Content = styled.div`
  flex: 1;
`;

const CardHeader = styled(Typography)`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
`;

const CardTitle = styled(Typography)`
  font-size: 20px;
  font-weight: bold;
`;

const SmallInfo = styled(Typography)`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const Description = styled(Typography)`
  font-size: 16px;
`;

export default function Card({ articulo }) {

    return (
        <StyledCard>
            {articulo.imagen && (
                <Image src={articulo.imagen || '../../assets/no_image.jpg'} alt={articulo.nombre} />
            )}
            <Content>

                <CardTitle variant="h5" component="div">
                    {articulo.nombre}
                </CardTitle>

                {articulo.categoria?.nombre && (
                    <SmallInfo>Categoría: {articulo.categoria.nombre}</SmallInfo>
                )}

                {articulo.proveedor && (
                    <SmallInfo>Proveedor: {articulo.proveedor}</SmallInfo>
                )}

                {articulo.precio_venta !== undefined && (
                    <SmallInfo>Precio: ${articulo.precio_venta}</SmallInfo>
                )}

                {articulo.inventario !== undefined && (
                    <SmallInfo>Inventario: {articulo.inventario}</SmallInfo>
                )}

                {articulo.descripcion && (
                    <Description>{articulo.descripcion}</Description>
                )}
            </Content>
        </StyledCard>
    );
}
