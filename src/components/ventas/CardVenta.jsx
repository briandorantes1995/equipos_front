import React from 'react';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';

const StyledCard = styled.div`
  width: 450px;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  background-color: #fefefe;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
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

const Table = styled.div`
  width: 100%;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #ccc;
`;

const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0; /* Aumentado el padding */
  border-bottom: 1px solid #eee;

  span {
    flex: 1;              /* Misma anchura para cada columna */
    text-align: center;   /* Centrado horizontal */
    font-size: 14px;
  }
`;

const TableHeader = styled(TableRow)`
  font-weight: bold;
  background-color: #fafafa; /* Pequeño fondo para resaltar el header */
  border-bottom: 2px solid #ccc;
`;

export default function CardVentaDetalle({ venta }) {

  const total = venta.detalles.reduce(
    (acc, detalle) => acc + Number(detalle.subtotal),
    0
  );

  return (
    <StyledCard>
      <CardTitle variant="h6">Venta #{venta.venta_id}</CardTitle>

      {venta.fecha && (
        <SmallInfo>Fecha: {new Date(venta.fecha).toLocaleDateString()}</SmallInfo>
      )}
      {venta.cliente_nombre && <SmallInfo>Cliente: {venta.cliente_nombre}</SmallInfo>}
      {venta.cliente_correo && <SmallInfo>Correo: {venta.cliente_correo}</SmallInfo>}
      {venta.cliente_telefono && <SmallInfo>Teléfono: {venta.cliente_telefono}</SmallInfo>}
      {venta.cliente_direccion && <SmallInfo>Dirección: {venta.cliente_direccion}</SmallInfo>}
      {venta.notas && <SmallInfo>Notas: {venta.notas}</SmallInfo>}

      <Table>
        <TableHeader>
          <span>Artículo</span>
          <span>Marca</span>
          <span>Proveedor</span>
          <span>Cant.</span>
          <span>Precio</span>
          <span>Subtotal</span>
        </TableHeader>

        {venta.detalles.map((detalle) => (
          <TableRow key={detalle.detalle_id}>
            <span>{detalle.articulo_nombre}</span>
            <span>{detalle.articulo_marca}</span>
            <span>{detalle.articulo_proveedor}</span>
            <span>{detalle.cantidad}</span>
            <span>${detalle.precio_unitario}</span>
            <span>${detalle.subtotal}</span>
          </TableRow>
        ))}

        <TableRow style={{ fontWeight: 'bold' }}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span>Total</span>
          <span>${total}</span>
        </TableRow>
      </Table>
    </StyledCard>
  );
}
