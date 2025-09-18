import React from 'react';
import {useSelector} from "react-redux"
import styled from 'styled-components';
import Typography from '@mui/material/Typography';

const StyledCard = styled.div`
  width: 280px;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  background-color: #fefefe;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
    border: 1px solid black;  
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardTitle = styled(Typography)`
  font-size: 18px;
  font-weight: bold;
  color: #222;
`;

const SmallInfo = styled(Typography)`
  font-size: 14px;
  color: #666;
`;

const Description = styled(Typography)`
  font-size: 14px;
  color: #444;
  margin-top: 8px;
`;

export default function Card({ articulo }) {
  const rol = useSelector(state => state.user.rol);
  console.log('Rendering Card for articulo:', articulo);
    return (
        <StyledCard>
            <Image src={(articulo?.imagen || "/no_image.jpg")} alt={articulo?.nombre || 'Sin nombre'} />
            <Content>
                <CardTitle variant="h6">{articulo.nombre}</CardTitle>

                {articulo.categoria?.nombre && (
                    <SmallInfo>Categoría: {articulo.categoria.nombre}</SmallInfo>
                )}

                {articulo.proveedor && rol === "admin" && (
                    <SmallInfo>Proveedor: {articulo.proveedor}</SmallInfo>
                )}


                {articulo?.marca && (
                    <SmallInfo>Marca: {articulo.marca}</SmallInfo>
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
