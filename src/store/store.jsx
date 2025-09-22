import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.jsx'
import cartReducer from './cartSlice.jsx'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';


const userPersistConfig = {
  key: 'user',
  storage,
};

const cartPersistConfig = {
  key: 'cart',
  storage,
};

const persistedReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
    reducer: {
        user: persistedReducer,
        cart: persistedCartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});


export const persistor = persistStore(store);