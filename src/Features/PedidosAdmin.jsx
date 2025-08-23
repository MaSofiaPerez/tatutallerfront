import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function PedidosAdmin() {
  const { user, token } = useSelector((state) => state.auth);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "admin") {
      setError("No autorizado");
      setLoading(false);
      return;
    }
    fetch(`${API_BASE_URL}/pedidos/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 403) {
          setError("No autorizado");
          setLoading(false);
          return [];
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPedidos(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar pedidos");
        setLoading(false);
      });
  }, [user, token]);

  const handleConfirmar = async (pedidoId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/pedidos/admin/${pedidoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: "CONFIRMADO" }),
      });
      if (res.status === 403) {
        setError("No autorizado");
        return;
      }
      if (res.ok) {
        setPedidos((prev) =>
          prev.map((p) =>
            p.id === pedidoId ? { ...p, estado: "CONFIRMADO" } : p
          )
        );
      }
    } catch (e) {
      setError("Error al confirmar el pedido");
    }
  };

  if (loading) {
    return <div>Cargando pedidos...</div>;
  }
  if (error) {
    return <div className="text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Pedidos
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{pedido.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pedido.email || pedido.usuarioEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        pedido.estado === "CONFIRMADO"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${pedido.montoTotal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pedido.estado !== "CONFIRMADO" && (
                      <button
                        onClick={() => handleConfirmar(pedido.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm transition-colors"
                      >
                        Confirmar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No hay pedidos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PedidosAdmin;
