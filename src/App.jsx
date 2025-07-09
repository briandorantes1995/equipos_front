import { Route, Routes } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import { Layout } from "./ui/Layout.jsx";
import Articulos from "./components/articulos/Articulos.jsx";
import CrearArticulo from "./components/articulos/CrearArticulo.jsx"; // ✅ Asegúrate de que el nombre del componente en el archivo también sea 'CrearArticulo'

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Articulos />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/articulos" element={<Articulos />} />
                <Route path="/agregarArticulo" element={<CrearArticulo />} />
            </Route>
        </Routes>
    );
}

export default App;


