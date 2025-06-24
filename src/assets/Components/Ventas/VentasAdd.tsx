import React, { useState } from 'react';
import { Venta, Employee, Cliente } from '../../../interfaces/types'; // Eliminamos Product ya que no es necesario
import './VentasAdd.css';

interface VentasAddProps {
  onAddVenta: (venta: Venta) => void;
  empleados: Employee[];
  clientes: Cliente[];
}

const VentasAdd: React.FC<VentasAddProps> = ({ onAddVenta, empleados, clientes }) => {
  const [productos, setProductos] = useState<{ nombre: string; cantidad: number; precio: number; id: number }[]>([]);
  const [fecha, setFecha] = useState('');
  const [empleado, setEmpleado] = useState<number | string>('');
  const [cliente, setCliente] = useState<number | string>('');
  const [metodoPago, setMetodoPago] = useState('');
  const [montoRecibido, setMontoRecibido] = useState<number>(0);
  const [cartItems, setCartItems] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [tarjetaNumero, setTarjetaNumero] = useState<string>('');

  const calcularTotal = () => productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const handleConfirm = () => {
    if (!fecha || cartItems.length === 0 || !cliente || !metodoPago || !empleado || montoRecibido < calcularTotal()) return;

    // Buscar información completa del empleado
    const empleadoVenta = empleados.find(e => String(e.id) === String(empleado));
    if (!empleadoVenta) {
      alert("Error: Empleado no encontrado");
      return;
    }

    // Buscar información del cliente
    const clienteVenta = clientes.find(c => String(c.id) === String(cliente));
    if (!clienteVenta) {
      alert("Error: Cliente no encontrado");
      return;
    }

    const nuevaVenta: Venta = {
      id: Date.now(),
      fecha,
      productos: cartItems.map(item => ({
        id: item.id,
        nombre: item.name,
        cantidad: item.quantity,
        precio: item.price || 0
      })),
      total: calcularTotal(),
      empleado: String(empleado), // ID del empleado
      empleadoNombre: empleadoVenta.name, // Nombre del empleado (propiedad requerida)
      cliente: clienteVenta.name, // Nombre del cliente
      metodoPago,
      montoRecibido: amountPaid,
      ...(metodoPago === 'tarjeta' && { tarjetaNumero })
    };

    onAddVenta(nuevaVenta);
    // Restablecer el estado después de agregar la venta
    setFecha('');
    setProductos([]);
    setEmpleado('');
    setCliente('');
    setMetodoPago('');
    setMontoRecibido(0);
    setCartItems([]);
    setAmountPaid(0);
    setTarjetaNumero('');
  };

  return (
    <div className="container">
      <h2 className="my-4">Agregar nueva venta</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Fecha:</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="form-control" required />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Empleado:</label>
            <select value={empleado} onChange={(e) => setEmpleado(e.target.value)} className="form-select" required>
              <option value="">Seleccionar empleado</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Cliente:</label>
            <select value={cliente} onChange={(e) => setCliente(e.target.value)} className="form-select" required>
              <option value="">Seleccionar cliente</option>
              {clientes.map((cli) => (
                <option key={cli.id} value={cli.id}>{cli.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Método de Pago:</label>
            <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} className="form-select" required>
              <option value="">Seleccionar método</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Monto Recibido:</label>
            <input type="number" value={montoRecibido} onChange={(e) => setMontoRecibido(Number(e.target.value) || 0)} className="form-control" required />
          </div>
        </div>
        <button type="submit" className="btn btn-success mt-3">Guardar Venta</button>
      </form>
    </div>
  );
};

export default VentasAdd;
