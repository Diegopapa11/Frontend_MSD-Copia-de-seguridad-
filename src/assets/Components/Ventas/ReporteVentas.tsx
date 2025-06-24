import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Venta, Employee } from "../../../interfaces/types";

interface ReporteVentasProps {
  ventas: Venta[];
  empleados: Employee[];
}

const ReporteVentas: React.FC<ReporteVentasProps> = ({ ventas, empleados }) => {
  const [reporte, setReporte] = useState<{ [key: string]: any }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const reportePorEmpleado: typeof reporte = {};
    empleados.forEach(emp => {
      reportePorEmpleado[emp.id] = {
        totalVentas: 0,
        cantidadVentas: 0,
        promedioVenta: 0,
        detalles: []
      };
    });

    ventas.forEach(venta => {
      const empleadoId = venta.empleado;
      if (empleadoId && reportePorEmpleado[empleadoId]) {
        reportePorEmpleado[empleadoId].totalVentas += venta.total;
        reportePorEmpleado[empleadoId].cantidadVentas += 1;
        reportePorEmpleado[empleadoId].detalles.push({
          id: venta.id,
          empleado: empleadoId,
          fecha: venta.fecha,
          monto: venta.total
        });
      }
    });

    Object.keys(reportePorEmpleado).forEach(empId => {
      const empData = reportePorEmpleado[empId];
      if (empData.cantidadVentas > 0) {
        empData.promedioVenta = empData.totalVentas / empData.cantidadVentas;
      }
    });

    setReporte(reportePorEmpleado);
  }, [ventas, empleados]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Reporte de Ventas por Empleado</h2>

      <div className="row">
        {empleados.map((empleado) => {
          const empData = reporte[empleado.id] || {
            totalVentas: 0,
            cantidadVentas: 0,
            promedioVenta: 0,
            detalles: []
          };

          return (
            <div key={empleado.id} className="col-md-6 mb-4">
              <div className="card btn">
                <div className="card-header bg-primary text-white">
                  <h3>{empleado.name}</h3>
                </div>
                <div className="card-body"
                onClick={() => navigate(`/admin/empleado/${empleado.id}`)}>
                  <p><strong>Total Ventas:</strong> ${empData.totalVentas.toFixed(2)}</p>
                  <p><strong>Cantidad Ventas:</strong> {empData.cantidadVentas}</p>
                  <p><strong>Promedio por Venta:</strong> ${empData.promedioVenta.toFixed(2)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReporteVentas;
