import { Route, Routes } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import {Layout} from "./ui/Layout.jsx";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
    );
}

export default App;

