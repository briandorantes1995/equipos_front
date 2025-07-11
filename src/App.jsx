import { Route, Routes } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import { Layout } from "./ui/Layout.jsx";
import Articulos from "./components/articulos/Articulos.jsx";
import CrearArticulo from "./components/articulos/CrearArticulo.jsx";
import Articulo from "./components/articulos/Articulo.jsx";
import EditarArticulo from "./components/articulos/EditarArticulo.jsx";
import BusquedaArticulos from "./components/articulos/BusquedaArticulos.jsx";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Articulos />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/articulos" element={<Articulos />} />
                <Route path="/articulos/:articuloId" element={<Articulo/>} />
                <Route path="/agregarArticulo" element={<CrearArticulo />} />
                <Route path="/editarArticulo/:articuloId" element={<EditarArticulo/>} />
                <Route path="/articulos/buscar/:busqueda" element={<BusquedaArticulos/>} />
            </Route>
        </Routes>
    );
}

export default App;


