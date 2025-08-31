import { Route, Routes } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import {Layout, RequireAuth} from "./ui/Layout.jsx";
import Articulos from "./components/articulos/Articulos.jsx";
import CrearArticulo from "./components/articulos/CrearArticulo.jsx";
import Articulo from "./components/articulos/Articulo.jsx";
import EditarArticulo from "./components/articulos/EditarArticulo.jsx";
import BusquedaArticulos from "./components/articulos/BusquedaArticulos.jsx";
import InventarioHome from "./components/inventarios/inventarioHome.jsx";
import InventarioTotal from "./components/inventarios/inventarioTotal.jsx";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Articulos />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/articulos" element={<Articulos />} />
                <Route path="/articulos/:articuloId" element={<Articulo />} />
                <Route path="/articulos/buscar/:busqueda" element={<BusquedaArticulos />} />

                <Route element={<RequireAuth allowedRoles={["admin"]} />}>
                    <Route path="/agregarArticulo" element={<CrearArticulo />} />
                    <Route path="/editarArticulo/:articuloId" element={<EditarArticulo />} />
                    <Route path="/inventarios" element={<InventarioHome />} />
                    <Route path="/inventarios/totales" element={<InventarioTotal />} />
                </Route>
            </Route>
        </Routes>

    );
}

export default App;


