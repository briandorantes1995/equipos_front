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
  padding: 8px 0; /* Aumentado igual que en ventas */
  border-bottom: 1px solid #eee;

  span {
    flex: 1;              /* Misma anchura para cada columna */
    text-align: center;   /* Centrado horizontal */
    font-size: 14px;
  }
`;

const TableHeader = styled(TableRow)`
  font-weight: bold;
  background-color: #fafafa; /* Resaltado del header */
  border-bottom: 2px solid #ccc;
`;

export default function CardCompraDetalle({ compra }) {
  const total = compra.detalles.reduce(
    (acc, detalle) => acc + detalle.subtotal,
    0
  );

  return (
    <div id="compra-card"> {/* Opcional, si quieres usarlo para imprimir */}
      <StyledCard>
        <CardTitle variant="h6">Compra #{compra.compra_id}</CardTitle>

        {compra.fecha && (
          <SmallInfo>Fecha: {new Date(compra.fecha).toLocaleDateString()}</SmallInfo>
        )}

        {compra.notas && <SmallInfo>Notas: {compra.notas}</SmallInfo>}

        <Table>
          <TableHeader>
            <span>Artículo</span>
            <span>Proveedor</span>
            <span>Cant.</span>
            <span>Precio</span>
            <span>Subtotal</span>
          </TableHeader>

          {compra.detalles.map((detalle) => (
            <TableRow key={detalle.detalle_id}>
              <span>{detalle.articulo_nombre}</span>
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
            <span>Total</span>
            <span>${total}</span>
          </TableRow>
        </Table>
      </StyledCard>
    </div>
  );
}


