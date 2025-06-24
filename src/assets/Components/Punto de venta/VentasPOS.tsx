import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FaRegWindowClose, FaRegMinusSquare, FaRegPlusSquare } from "react-icons/fa";
import { Venta, Employee, Cliente, Product } from '../../../interfaces/types';
import "./VentasPOS.css";

interface CartItem extends Product {
  quantity: number;
}

interface VentasPOSProps {
  onAddVenta: (venta: Venta) => void;
  empleados: Employee[];
  clientes: Cliente[];
  products: Product[];
  empleadoAutenticado: Employee | null;
}

const VentasPOS: React.FC<VentasPOSProps> = ({ onAddVenta, empleados, clientes, products, empleadoAutenticado }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]); 
  const [empleado, setEmpleado] = useState<number | string>(empleadoAutenticado ? empleadoAutenticado.id : '');
  const [cliente, setCliente] = useState<number | string>(''); 
  const [metodoPago, setMetodoPago] = useState('efectivo'); 
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showPOS, setShowPOS] = useState<boolean>(false);
  const [tarjetaNumero, setTarjetaNumero] = useState<string>('');

  // Calcular el total de la venta
  const calcularTotal = () => cartItems.reduce((sum, p) => sum + (p.price || 0) * p.quantity, 0);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const eliminarProducto = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const agregarProducto = (product: Product) => {
    setCartItems(prevItems => {
      const exists = prevItems.find(p => p.id === product.id);
      return exists
        ? prevItems.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
        : [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handlePayment = () => {
    if (metodoPago === "efectivo" && amountPaid < calcularTotal()) {
      alert("El monto ingresado es insuficiente.");
      return;
    }
    setShowModal(true);
  };

  // Confirmar venta con validación adicional
  const handleConfirm = () => {
    if (!fecha || cartItems.length === 0 || !cliente || !metodoPago || !empleado) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Validación del empleado
    const empleadoVenta = empleados.find(e => String(e.id) === String(empleado));
    if (!empleadoVenta) {
      alert("Empleado no encontrado.");
      return;
    }

    // Validación del cliente
    const clienteVenta = clientes.find(c => String(c.id) === String(cliente));
    if (!clienteVenta) {
      alert("Cliente no encontrado.");
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
      empleado: String(empleado),
      empleadoNombre: empleadoVenta.name,
      cliente: clienteVenta.name,
      metodoPago,
      montoRecibido: amountPaid,
      ...(metodoPago === 'tarjeta' && { tarjetaNumero })
    };
    // Navegar al ticket con la venta
    navigate("/ticket", { state: { ...nuevaVenta, cart: nuevaVenta.productos } });

    navigate("/ticket", {
      state: {
        cart: nuevaVenta.productos,
        total: nuevaVenta.total,
        paymentAmount: nuevaVenta.montoRecibido,
        paymentMethod: nuevaVenta.metodoPago,
        change: nuevaVenta.montoRecibido - nuevaVenta.total,
        fecha: nuevaVenta.fecha,
        empleado: nuevaVenta.empleadoNombre,
        cliente: nuevaVenta.cliente,
        tarjetaNumero: nuevaVenta.metodoPago === 'tarjeta' ? nuevaVenta.tarjetaNumero : undefined
      }
    });
    
    // Llamada a la función que maneja la venta
    onAddVenta(nuevaVenta);

    // Guardar la venta en el localStorage como respaldo
    const ventasGuardadas = JSON.parse(localStorage.getItem('ventas') || '[]');
    ventasGuardadas.push(nuevaVenta);
    localStorage.setItem('ventas', JSON.stringify(ventasGuardadas));

    // Resetear estado
    setFecha('');
    setCartItems([]);
    setEmpleado('');
    setCliente('');
    setMetodoPago('');
    setAmountPaid(0);
    setTarjetaNumero('');
    setShowPOS(false);
    setShowModal(false);
  };

  const mostrarPOS = () => {
    if (!cliente) {
      alert("Por favor complete todos los campos básicos de la venta");
      return;
    }
    setShowPOS(true);
  };

  return (
    <div className="container">
      {!showPOS ? (
        // Formulario inicial de venta
        <div>
          <h2 className="my-4">Nueva Venta</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Fecha:</label>
                <input 
                  type="date" 
                  value={fecha} 
                  onChange={(e) => setFecha(e.target.value)} 
                  className="form-control" 
                  required 
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Empleado:</label>
                <select 
                  value={empleado} 
                  onChange={(e) => setEmpleado(e.target.value)} 
                  className="form-select" 
                  required
                  disabled
                >
                  <option value={empleadoAutenticado?.id}>{empleadoAutenticado?.name}</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Cliente:</label>
                <select 
                  value={cliente} 
                  onChange={(e) => {
                    const selectedCliente = e.target.value.toString();
                    setCliente(selectedCliente);
                  }} 
                  className="form-select" 
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cli) => (
                    <option key={cli.id} value={cli.id}>{cli.name}</option>
                  ))}
                </select>

              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Método de Pago:</label>
                <select 
                  value={metodoPago} 
                  onChange={(e) => setMetodoPago(e.target.value)} 
                  className="form-select" 
                  required
                >
                  <option value="">Seleccionar método</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>
            </div>

            <button 
              className="btn btn-primary mt-3"
              onClick={mostrarPOS}
            >
              Continuar a Punto de Venta
            </button>
          </form>
        </div>
      ) : (
        // Vista de Punto de Venta
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Punto de Venta</h2>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowPOS(false)}
            >
              Volver a datos de venta
            </button>
          </div>

          <div className="row">
            {/* Lista de productos disponibles */}
            <div className="col-md-6">
              <h4>Productos Disponibles</h4>
              <div className="row row-cols-2 row-cols-md-2 g-1">
                {products.map((product) => (
                  <div key={product.id} className="col">
                    <div 
                      className="card h-100 cursor-pointer"
                      onClick={() => agregarProducto(product)}
                    >
                      {product.image && (
                        <img 
                          src={product.image} 
                          className="card-img-top" 
                          alt={product.name}
                          style={{ height: '200px', width: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text text-success">${product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrito de compras */}
            <div className="col-md-6">
              <div className="sticky-top" style={{ top: '20px' }}>
                <h4>Resumen de Venta</h4>

                {/* Información de la venta */}
                <div className="card mb-3">
                  <div className="card-body">
                    <p><strong>Fecha:</strong> {fecha}</p>
                    <p><strong>Empleado:</strong> {empleadoAutenticado?.name}</p>
                    <p><strong>Cliente:</strong> {cliente ? clientes.find(c => String(c.id) === String(cliente))?.name || 'Cliente no encontrado' : 'No seleccionado'}</p>
                    <p><strong>Método de pago:</strong> {metodoPago === 'efectivo' ? 'Efectivo' : 'Tarjeta'}</p>
                  </div>
                </div>

                {/* Productos en carrito */}
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Productos</h5>
                    <ul className="list-group mb-3">
                      {cartItems.map((item) => (
                        <li key={item.id} className="list-group-item">
                          <div className="align-items-center">
                            <h4>{item.name}</h4>
                            <div className='justify-content-between'>
                              <div className="d-flex align-items-center">
                                <h6>${item.price} c/u</h6>
                                <div className="input-group ms-3" style={{ width: '90px' }}>
                                  <FaRegMinusSquare className="btn-outline-secondary" style={{ height: '70px' }} onClick={() => handleQuantityChange(item.id, item.quantity - 1)}/>
                                  <input
                                    className="form-control text-center"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                    min="1"
                                  />
                                  <FaRegPlusSquare className="btn-outline-secondary" style={{ height: '70px' }} onClick={() => handleQuantityChange(item.id, item.quantity + 1)}/>
                                </div>
                                <span className="ms-5">${(item.price || 0) * item.quantity}</span>
                                <button 
                                  className="btn-danger ms-7"
                                  onClick={() => eliminarProducto(item.id)}
                                  style={{ width: '40px' }}
                                >
                                  <FaRegWindowClose />
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {cartItems.length === 0 && (
                      <div className="alert alert-warning">No hay productos en el carrito</div>
                    )}
                  </div>
                </div>

                {/* Total y opciones de pago */}
                <div className="card">
                  <div className="card-body">
                    <h5 className="d-flex justify-content-between">
                      <span>Total:</span>
                      <span>${calcularTotal().toFixed(2)}</span>
                    </h5>

                    {metodoPago === 'tarjeta' ? (
                      <div className="mb-3">
                        <label className="form-label">Número de Referencia</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="N.12345"
                          value={tarjetaNumero}
                          onChange={(e) => setTarjetaNumero(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label className="form-label">Monto Recibido</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                          min={calcularTotal()}
                        />
                        {amountPaid > 0 && amountPaid < calcularTotal() && (
                          <div className="text-danger mt-1">Monto insuficiente</div>
                        )}
                      </div>
                    )}

                    <button 
                      className="btn btn-success w-100 py-2"
                      onClick={handlePayment}
                      disabled={cartItems.length === 0 || (metodoPago === 'efectivo' && amountPaid < calcularTotal())}
                    >
                      Confirmar Venta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de confirmar esta venta?</p>
          <p><strong>Total:</strong> ${calcularTotal().toFixed(2)}</p>
          {metodoPago === 'efectivo' && (
            <>
              <p><strong>Efectivo recibido:</strong> ${amountPaid.toFixed(2)}</p>
              <p><strong>Cambio:</strong> ${(amountPaid - calcularTotal()).toFixed(2)}</p>
            </>
          )}
          {metodoPago === 'tarjeta' && tarjetaNumero && (
            <p><strong>Tarjeta:</strong> ****** {tarjetaNumero.slice(-1)}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className='d-flex justify-content-between'>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VentasPOS;