import React, { useState } from "react";

interface PaymentFormProps {
  total: number; // Total a pagar
  onPaymentConfirmed: (payment: number) => void; // Función que maneja el pago confirmado
}

const PaymentForm: React.FC<PaymentFormProps> = ({ total, onPaymentConfirmed }) => {
  const [payment, setPayment] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof payment === "number" && payment >= total) {
      onPaymentConfirmed(payment); // Llamamos a la función con el monto pagado
    } else {
      alert("El monto ingresado es insuficiente.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Ingresar Pago</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Total a Pagar: ${total.toFixed(2)} MXN</label>
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

export default PaymentForm;
