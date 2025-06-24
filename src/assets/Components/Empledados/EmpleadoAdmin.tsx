import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Venta, Employee } from "../../../interfaces/types";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

interface EmpleadoAdminProps {
  ventas: Venta[];
  empleados: Employee[];
}

const EmpleadoAdmin: React.FC<EmpleadoAdminProps> = ({ ventas, empleados }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const empleadoId = Number(id);

  const [reporte, setReporte] = useState<{
    totalVentas: number;
    cantidadVentas: number;
    promedioVenta: number;
    detalles: Venta[];
  }>({
    totalVentas: 0,
    cantidadVentas: 0,
    promedioVenta: 0,
    detalles: []
  });

  const [ventasPorMes, setVentasPorMes] = useState<any>([]);
  const [ventasTotalesPorFecha, setVentasTotalesPorFecha] = useState<any>([]);

  const empleado = empleados.find((emp) => emp.id === empleadoId);

  useEffect(() => {
    if (!empleado) return;

    let totalVentas = 0;
    let cantidadVentas = 0;
    const detalles: Venta[] = [];
    const ventasPorMes: { [key: string]: number } = {};
    const ventasTotalesPorFecha: { [key: string]: number } = {};

    ventas.forEach((venta) => {
      if (venta.empleado === id) {
        totalVentas += venta.total;
        cantidadVentas += 1;
        detalles.push(venta);

        const fecha = new Date(venta.fecha);
        const mes = `${fecha.getMonth() + 1}-${fecha.getFullYear()}`;
        ventasPorMes[mes] = (ventasPorMes[mes] || 0) + 1;

        const fechaString = fecha.toLocaleDateString();
        ventasTotalesPorFecha[fechaString] = (ventasTotalesPorFecha[fechaString] || 0) + venta.total;
      }
    });

    const promedioVenta = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

    setReporte({ totalVentas, cantidadVentas, promedioVenta, detalles });
    setVentasPorMes(ventasPorMes);
    setVentasTotalesPorFecha(ventasTotalesPorFecha);
  }, [ventas, empleadoId, empleado]);

  if (!empleado) {
    return (
      <div className="container mt-4">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Volver</button>
        <h2 className="text-danger">Empleado no encontrado</h2>
      </div>
    );
  }

  // Gráfico de ventas por mes (Barras)
  const ventasPorMesChartData = {
    labels: Object.keys(ventasPorMes),
    datasets: [
      {
        label: "Ventas por Mes",
        data: Object.values(ventasPorMes),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Gráfico de ventas totales por fecha (Líneas)
  const ventasTotalesChartData = {
    labels: Object.keys(ventasTotalesPorFecha),
    datasets: [
      {
        label: "Ventas Totales",
        data: Object.values(ventasTotalesPorFecha),
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Volver</button>
      <h2 className="text-center">Administración de {empleado.name}</h2>
      <p className="text-center">Aquí puedes editar información del empleado, revisar sus ventas, etc.</p>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-2">
            <h5>Total de ventas</h5>
            <p className="">${reporte.totalVentas.toFixed(2)}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-2">
            <h5>Cantidad de ventas</h5>
            <p className="">{reporte.cantidadVentas}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-2">
            <h5>Promedio por venta</h5>
            <p className="">${reporte.promedioVenta.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Ventas por Mes</h4>
          <Bar data={ventasPorMesChartData} options={{ responsive: true }} />
        </div>
        <div className="col-md-6">
          <h4>Ventas Totales por Fecha</h4>
          <Line data={ventasTotalesChartData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="container row mb-4">
        <h4>Detalle de Ventas</h4>
      {reporte.detalles.length > 0 ? (
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Fecha</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {reporte.detalles.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                <td>${venta.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">Este empleado no tiene ventas registradas.</p>
      )}
      </div>
      
    </div>
  );
};

export default EmpleadoAdmin;
