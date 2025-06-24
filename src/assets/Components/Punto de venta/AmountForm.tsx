import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AmountForm: React.FC<{ totalPrice: number; onConfirm: (payment: number) => void }> = ({ totalPrice, onConfirm }) => {
  const [payment, setPayment] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof payment === "number" && payment >= totalPrice) {
      onConfirm(payment);  // Pasamos el monto pagado al Ticket
    } else {
      alert("El monto ingresado es insuficiente.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Ingresar Pago</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Total a Pagar: ${totalPrice.toFixed(2)} MXN</label>
          <input 
            type="number" 
            className="form-control" 
            value={payment} 
            onChange={(e) => setPayment(Number(e.target.value))} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Confirmar Pago</button>
      </form>
    </div>
  );
};

export default AmountForm;
