import React from "react";
import { useNavigate } from "react-router-dom";
import { Venta } from "../../../interfaces/types";
import "./VentasList.css";

interface VentasListProps {
  ventas: Venta[];
}

const VentasList: React.FC<VentasListProps> = ({ ventas }) => {
  const navigate = useNavigate();

  // Formatear fecha con manejo de errores
  const formatFecha = (fecha?: string) => {
    try {
      if (!fecha) return "Fecha no disponible";
      const parsedDate = new Date(fecha);
      return isNaN(parsedDate.getTime())
        ? "Fecha inválida"
        : parsedDate.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
    } catch (error) {
      console.error("Error al formatear la fecha", error);
      return "Error al formatear fecha";
    }
  };

  // Ordenar ventas con manejo de errores
  const ventasOrdenadas = [...ventas].sort((a, b) => {
    try {
      const dateA = new Date(a.fecha).getTime() || 0;
      const dateB = new Date(b.fecha).getTime() || 0;
      return dateB - dateA;
    } catch (error) {
      console.error("Error al ordenar las ventas", error);
      return 0;
    }
  });

  return (
    <div className="card">
      <div className="encabezado">
        <h2 className="sales-title">Ventas realizadas</h2>
        <button onClick={() => navigate("/ventas/add")} className="add-sale-btn">
          Agregar Venta
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Empleado</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Método Pago</th>
            </tr>
          </thead>
          <tbody>
            {ventasOrdenadas.length > 0 ? (
              ventasOrdenadas.map((venta) => (
                <tr key={venta.id}>
                  <td>{formatFecha(venta.fecha)}</td>
                  <td>
                    {venta.productos?.length ? (
                      venta.productos.map((prod, index) => (
                        <div key={`${venta.id}-${prod.id || index}`}>
                          {prod.nombre} (x{prod.cantidad || 0}) - $
                          {typeof prod.precio === "number"
                            ? prod.precio.toFixed(2)
                            : "0.00"}
                        </div>
                      ))
                    ) : (
                      "No hay productos"
                    )}
                  </td>
                  <td>{venta.empleadoNombre || venta.empleado || "No especificado"}</td>
                  <td>{venta.cliente || "No especificado"}</td>
                  <td className="total">${venta.total?.toFixed(2) || "0.00"}</td>
                  <td>
                    {venta.metodoPago === "efectivo"
                      ? "Efectivo"
                      : venta.metodoPago === "tarjeta"
                      ? `Referencia (******${venta.tarjetaNumero?.slice(-1) || "XXXX"})`
                      : "No especificado"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="no-sales">
                  No hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VentasList;
