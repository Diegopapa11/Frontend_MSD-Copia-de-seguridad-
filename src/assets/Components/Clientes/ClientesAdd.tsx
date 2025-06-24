import React, { useState } from 'react';
import { Cliente } from '../../../interfaces/types';

interface ClientesAddProps {
  onAddCliente: (cliente: Cliente) => void;
  onClose: () => void;
}

const ClientesAdd: React.FC<ClientesAddProps> = ({ onAddCliente, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState(''); // Nuevo estado para teléfono
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email || !telefono) return;

    const nuevoCliente: Cliente = {
      id: Date.now(),
      name: nombre,
      email,
      phone: telefono
    };

    onAddCliente(nuevoCliente);
    setShowSuccess(true);
    setNombre('');
    setEmail('');
    setTelefono('');

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="w-100 max-w-md p-4 bg-white rounded shadow-lg">
        <h2 className="text-center mb-4">Agregar Cliente</h2>
        
        {showSuccess ? (
          <div className="alert alert-success text-center">
            ¡Cliente agregado exitosamente! Redirigiendo...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono:</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2">
              Agregar Cliente
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClientesAdd;