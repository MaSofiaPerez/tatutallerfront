import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

// Componentes que crearemos
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./features/Home";
import Login from "./features/Login";
import Register from "./features/Register";
import AdminPanel from "./features/AdminPanel";
import Tienda from "./features/Tienda";
import Clases from "./features/Clases";

function App() {
  // Cuando tengamos el auth slice, esto funcionará
  // const { user } = useSelector(state => state.auth)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/clases" element={<Clases />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
