import { Route, Routes } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import {Layout, RequireAuth} from "./ui/Layout.jsx";
import Articulos from "./components/articulos/Articulos.jsx";
import CrearArticulo from "./components/articulos/CrearArticulo.jsx";
import Articulo from "./components/articulos/Articulo.jsx";
import EditarArticulo from "./components/articulos/EditarArticulo.jsx";
import BusquedaArticulos from "./components/articulos/BusquedaArticulos.jsx";
import InventarioHome from "./components/inventarios/InventarioHome.jsx";
import InventarioTotal from "./components/inventarios/inventarioTotal.jsx";
import MovimientoTotal from "./components/Movimientos/movimientosTotales.jsx";
import ComprasHome from "./components/compras/comprasHome.jsx";
import RegistrarCompra from "./components/compras/registrarCompra.jsx";
import ComprasTotales from "./components/compras/ComprasTotales.jsx";
import Compra from "./components/compras/compraDetalle.jsx";
import EditarCompra from "./components/compras/editarCompra.jsx";
import Categorias from "./components/categorias/Categorias.jsx";
import TomaFisica from "./components/inventarios/TomaFisica.jsx";
import FolioInventario from "./components/inventarios/FolioInventario.jsx";


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
                    <Route path="/editarArticulo/:articuloId" element={<EditarArticulo />}/>
                    <Route path="/categorias" element={<Categorias />} />
                    <Route path="/inventarios" element={<InventarioHome />} />
                    <Route path="/inventarios/tomas" element={<TomaFisica />} />
                    <Route path="/inventarios/tomas/:folio/:categoria" element={<FolioInventario/>} />
                    <Route path="/inventarios/totales" element={<InventarioTotal />} />
                    <Route path="/movimientos" element={<MovimientoTotal/>} />
                    <Route path="/compras" element={<ComprasHome/>} />
                    <Route path="/compras/registro" element={<RegistrarCompra/>} />
                    <Route path="/compras/totales" element={<ComprasTotales/>} />
                    <Route path="/compras/:compraId" element={<Compra />} />
                    <Route path="/compras/editar/:compraId" element={<EditarCompra />} />
                </Route>
            </Route>
        </Routes>

    );
}

export default App;


