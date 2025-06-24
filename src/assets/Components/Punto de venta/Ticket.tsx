import React, { useEffect, useState } from "react";
import { Venta } from "../../../interfaces/types";

const Ticket: React.FC = () => {
  const [venta, setVenta] = useState<Venta | null>(null);

  useEffect(() => {
    try {
      const ventasGuardadas: Venta[] = JSON.parse(localStorage.getItem("ventas") || "[]");
      console.log("Ventas en localStorage:", ventasGuardadas);

      if (Array.isArray(ventasGuardadas) && ventasGuardadas.length > 0) {
        setVenta(ventasGuardadas[ventasGuardadas.length - 1]);
      } else {
        console.warn("No hay ventas válidas en localStorage.");
      }
    } catch (error) {
      console.error("Error al cargar ventas desde localStorage:", error);
    }
  }, []);

  if (!venta) {
    return <p className="text-center mt-4">No hay información de la venta.</p>;
  }

  const { fecha, productos, total, empleadoNombre, cliente, metodoPago, montoRecibido, tarjetaNumero } = venta;
  const cambio = metodoPago === "efectivo" ? (montoRecibido - total).toFixed(2) : "0.00";

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">Ticket de Compra</h2>
          <div className="text-center">
            <p>Fecha: {new Date(fecha).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="card-body">
          <div className="mb-4">
            <h4>Detalles de la Venta</h4>
            <p><strong>Empleado:</strong> {empleadoNombre}</p>
            <p><strong>Cliente:</strong> {cliente}</p>
            <p><strong>Método de pago:</strong> {metodoPago === "efectivo" ? "Efectivo" : "Tarjeta"}</p>
            {metodoPago === "tarjeta" && tarjetaNumero && (
              <p><strong>Tarjeta:</strong> *{tarjetaNumero.slice(-4)}</p>
            )}
          </div>

          <h4>Productos:</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(productos) && productos.length > 0 ? (
                productos.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad || 1}</td>
                    <td>${Number(item.precio).toFixed(2)}</td>
                    <td>${(Number(item.precio) * Number(item.cantidad || 1)).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">No hay productos</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                <td><strong>${Number(total).toFixed(2)}</strong></td>
              </tr>
              {metodoPago === "efectivo" && (
                <>
                  <tr>
                    <td colSpan={3} className="text-end"><strong>Efectivo recibido:</strong></td>
                    <td><strong>${Number(montoRecibido).toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-end"><strong>Cambio:</strong></td>
                    <td><strong>${cambio}</strong></td>
                  </tr>
                </>
              )}
            </tfoot>
          </table>

          <div className="text-center mt-4">
            <p className="lead">¡Gracias por su compra!</p>
            <p>Vuelva pronto</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;