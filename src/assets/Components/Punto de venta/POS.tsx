import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { Product } from "../../../interfaces/types";
import PaymentForm from "./PaymentForm";
import AmountForm from "./AmountForm";

interface CartItem extends Product {
  quantity: number;
}

const POS: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recupera el carrito, el método de pago y el cliente desde el estado de la ubicación
  const receivedCart = (location.state as { cart: CartItem[], paymentMethod: string, cliente: any }) || { cart: [], paymentMethod: "", cliente: null };
  
  const [cartItems, setCartItems] = useState<CartItem[]>(receivedCart.cart);
  const [amountPaid, setAmountPaid] = useState<number>(0); // Guardar el monto pagado
  const [showModal, setShowModal] = useState<boolean>(false);
  
  // Obtener los datos del cliente
  const cliente = receivedCart.cliente;

  const getSafePrice = (price: any): number => {
    const num = typeof price === 'number' ? price : Number(price);
    return isNaN(num) ? 0 : num;
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getItemSubtotal = (item: CartItem) => {
    const price = getSafePrice(item.price);
    return price * item.quantity;
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + getItemSubtotal(item), 0);
  };

  const handlePayment = (payment: number) => {
    setAmountPaid(payment);
    if (receivedCart.paymentMethod === "Efectivo" && payment < getTotal()) {
      alert("El monto ingresado es insuficiente.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = () => {
    navigate("/ticket", {
      state: {
        cart: cartItems.map(item => ({
          ...item,
          price: getSafePrice(item.price)
        })),
        total: getTotal(),
        amountPaid,
        change: receivedCart.paymentMethod === "Efectivo" ? amountPaid - getTotal() : 0,
        cliente, // Pasar el cliente al ticket
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Punto de Venta</h2>
        <div className="alert alert-warning">El carrito está vacío</div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(-1)}
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Punto de Venta</h2>
      <div className="row">
        <div className="col-md-12">
          <h4>Resumen de Compra</h4>
          <ul className="list-group mb-4">
            {cartItems.map((item) => {
              const price = getSafePrice(item.price);
              const subtotal = price * item.quantity;
              
              return (
                <li key={item.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="img-thumbnail me-3"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      )}
                      <div>
                        <h6 className="mb-1">{item.name}</h6>
                        <small className="text-muted">{item.description}</small>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <div className="me-3 text-end">
                        <div>Precio: ${price.toFixed(2)}</div>
                        <div className="fw-bold">Subtotal: ${subtotal.toFixed(2)}</div>
                      </div>
                      
                      <div className="input-group" style={{ width: "120px" }}>
                        <button 
                          className="btn btn-outline-secondary" 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          className="form-control text-center"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button 
                          className="btn btn-outline-secondary" 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          
          <div className="card">
            <div className="card-body">
              <h5 className="card-title d-flex justify-content-between">
                <span>Total:</span>
                <span>${getTotal().toFixed(2)}</span>
              </h5>

              {/* Mostrar el formulario correspondiente según el método de pago */}
              {receivedCart.paymentMethod === "Tarjeta" ? (
                <PaymentForm total={getTotal()} onPaymentConfirmed={handlePayment} />
              ) : (
                <AmountForm totalPrice={getTotal()} onConfirm={handlePayment} />
              )}

              <button 
                className="btn btn-success w-100 mt-2 py-2"
                onClick={() => handlePayment(amountPaid)}
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body className="text-center text-white bg-success p-4">
          <h5>Se ha pagado y registrado correctamente</h5>
          <Button variant="light" className="mt-3" onClick={handleConfirm}>Aceptar</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default POS;
