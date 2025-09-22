import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateCantidad, clearCart } from "../../store/cartSlice";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  TextField,
  Box,
  Divider
} from "@mui/material";
import { Delete } from "@mui/icons-material";

function Carrito() {
  const dispatch = useDispatch();
  const { items, totalCantidad, totalPrecio } = useSelector(
    (state) => state.cart
  );

  const handleCantidadChange = (id, cantidad) => {
    const nuevaCantidad = parseInt(cantidad, 10);
    if (nuevaCantidad > 0) {
      dispatch(updateCantidad({ id, cantidad: nuevaCantidad }));
    }
  };

  const handleEliminar = (id) => {
    dispatch(removeItem(id));
  };

  const handleVaciar = () => {
    dispatch(clearCart());
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>

      {items.length === 0 ? (
        <Typography variant="body1">Tu carrito está vacío 🛒</Typography>
      ) : (
        <>
          {items.map((item) => (
            <Card
              key={item.id}
              sx={{ marginBottom: 2, backgroundColor: "#f9f9f9" }}
            >
              <CardContent>
                <Typography variant="h6">{item.nombre}</Typography>
                {item.marca && (
                  <Typography variant="body2" color="text.secondary">
                    Marca: {item.marca}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {item.descripcion}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  Precio: ${item.precio.toFixed(2)}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 1,
                    gap: 2,
                  }}
                >
                  <TextField
                    type="number"
                    size="small"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleCantidadChange(item.id, e.target.value)
                    }
                    inputProps={{ min: 1 }}
                    sx={{ width: "80px" }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleEliminar(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}

          <Divider sx={{ marginY: 2 }} />

          <Typography variant="h6">
            Total artículos: {totalCantidad}
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Total a pagar: ${totalPrecio.toFixed(2)}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleVaciar}
            >
              Vaciar Carrito
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => alert("En Proceso")}
            >
              Proceder al Pago
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Carrito;
