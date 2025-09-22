import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // cada item: {id, nombre, descripcion, precio, cantidad, marca?}
  totalCantidad: 0,
  totalPrecio: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload; 
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.cantidad += item.cantidad;
      } else {
        state.items.push({
          id: item.id,
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          cantidad: item.cantidad,
          ...(item.marca && { marca: item.marca }) // 👈 solo si existe
        });
      }

      state.totalCantidad += item.cantidad;
      state.totalPrecio += item.precio * item.cantidad;
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((i) => i.id === id);

      if (existingItem) {
        state.totalCantidad -= existingItem.cantidad;
        state.totalPrecio -= existingItem.precio * existingItem.cantidad;
        state.items = state.items.filter((i) => i.id !== id);
      }
    },
    updateCantidad: (state, action) => {
      const { id, cantidad } = action.payload;
      const existingItem = state.items.find((i) => i.id === id);

      if (existingItem) {
        state.totalCantidad += cantidad - existingItem.cantidad;
        state.totalPrecio +=
          existingItem.precio * (cantidad - existingItem.cantidad);

        existingItem.cantidad = cantidad;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalCantidad = 0;
      state.totalPrecio = 0;
    },
  },
});

export const { addItem, removeItem, updateCantidad, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;

