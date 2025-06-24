import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Registrar componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface VentasData {
  [key: string]: number;
}

interface ProductosData {
  [key: string]: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ventasEmpleado, setVentasEmpleado] = useState<VentasData>({});
  const [productosVendidos, setProductosVendidos] = useState<ProductosData>({});
  const [ventasTienda, setVentasTienda] = useState<VentasData>({});
  const [rendimientoTienda, setRendimientoTienda] = useState<VentasData>({});

  const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado') || '{}');

  useEffect(() => {
    // Redirigir si no está autenticado
    if (!usuarioAutenticado.id) {
      navigate("/login");
      return;
    }

    // Simulación de carga de datos
    const fetchData = async () => {
      try {
        // En una aplicación real, aquí harías llamadas a la API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Datos mock para empleado
        setVentasEmpleado({
          enero: 15,
          febrero: 22,
          marzo: 18,
          abril: 30,
          mayo: 25
        });
        
        setProductosVendidos({
          'Producto A': 12,
          'Producto B': 8,
          'Producto C': 15,
          'Producto D': 5
        });
        
        // Datos mock para admin
        setVentasTienda({
          enero: 120,
          febrero: 150,
          marzo: 180,
          abril: 200,
          mayo: 250
        });
        
        setRendimientoTienda({
          'Semana 1': 30,
          'Semana 2': 50,
          'Semana 3': 70,
          'Semana 4': 90
        });
        
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, usuarioAutenticado.id]);

  if (!usuarioAutenticado || !usuarioAutenticado.rol) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando tus datos de ventas...</p>
      </div>
    );
  }

  // Función para encontrar el producto más vendido
  const encontrarProductoEstrella = (productos: ProductosData): string => {
    return Object.entries(productos).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  return (
    <div className="row">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Bienvenido, {usuarioAutenticado.name || 'Usuario'}</h1>
          <p className="lead">Rol: {usuarioAutenticado.rol === 'admin' ? 'Administrador' : 'Empleado'}</p>
        </div>
      </div>
      
      {usuarioAutenticado.rol === 'admin' && (
        <>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Ventas por Mes</h5>
                  <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                    <Bar 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: true, text: 'Ventas Mensuales' }
                        }
                      }}
                      data={{
                        labels: Object.keys(ventasTienda),
                        datasets: [{
                          label: 'Ventas',
                          data: Object.values(ventasTienda),
                          backgroundColor: 'rgba(53, 162, 235, 0.5)'
                        }]
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card h-90">
                <div className="card-body">
                  <h5 className="card-title">Rendimiento de Ventas</h5>
                  <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                    <Line 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: true, text: 'Rendimiento' }
                        }
                      }}
                      data={{
                        labels: Object.keys(rendimientoTienda),
                        datasets: [{
                          label: 'Rendimiento',
                          data: Object.values(rendimientoTienda),
                          borderColor: 'rgb(255, 99, 132)',
                          backgroundColor: 'rgba(255, 99, 132, 0.5)',
                          tension: 0.1
                        }]
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 align-items-center">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Métricas Globales</h5>
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="p-3 bg-light rounded">
                        <h3>{Object.values(ventasTienda).reduce((a, b) => a + b, 0)}</h3>
                        <p className="mb-0">Ventas totales</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 bg-light rounded">
                        <h3>{Math.max(...Object.values(ventasTienda))}</h3>
                        <p className="mb-0">Mejor mes</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 bg-light rounded">
                        <h3>{(Object.values(ventasTienda).reduce((a, b) => a + b, 0) / Object.keys(ventasTienda).length).toFixed(1)}</h3>
                        <p className="mb-0">Promedio mensual</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 bg-light rounded">
                        <h3>+{(Object.values(ventasTienda)[Object.values(ventasTienda).length - 1] - Object.values(ventasTienda)[0])}</h3>
                        <p className="mb-0">Crecimiento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {usuarioAutenticado.rol === 'employee' && (
        <>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Tus Ventas Mensuales</h5>
                  <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                    <Bar 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: true, text: 'Tus Ventas' }
                        }
                      }}
                      data={{
                        labels: Object.keys(ventasEmpleado),
                        datasets: [{
                          label: 'Ventas realizadas',
                          data: Object.values(ventasEmpleado),
                          backgroundColor: 'rgba(75, 192, 192, 0.6)'
                        }]
                      }} 
                    />
                  </div>
                  <p className="mt-2 text-muted">Total: {Object.values(ventasEmpleado).reduce((a, b) => a + b, 0)} ventas</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Tus Productos Más Vendidos</h5>
                  <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                    <Pie 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: true, text: 'Tus Productos' }
                        }
                      }}
                      data={{
                        labels: Object.keys(productosVendidos),
                        datasets: [{
                          data: Object.values(productosVendidos),
                          backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                          ]
                        }]
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Tus Métricas</h5>
                  <div className="row text-center">
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded">
                        <h3>{Object.values(ventasEmpleado).reduce((a, b) => a + b, 0)}</h3>
                        <p className="mb-0">Ventas totales</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded">
                        <h3>{Math.max(...Object.values(ventasEmpleado))}</h3>
                        <p className="mb-0">Mejor mes</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-light rounded">
                        <h3>{encontrarProductoEstrella(productosVendidos)}</h3>
                        <p className="mb-0">Producto estrella</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;