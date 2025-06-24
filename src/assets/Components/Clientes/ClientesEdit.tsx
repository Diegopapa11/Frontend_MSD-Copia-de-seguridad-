import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Cliente } from "../../../interfaces/types";

interface ClientesEditProps {
  clientes: Cliente[];
  onUpdateCliente: (cliente: Cliente) => void;  // Only keep the onUpdateCliente prop
}

const ClientesEdit: React.FC<ClientesEditProps> = ({ clientes, onUpdateCliente }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<Cliente, 'id'>>({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (id) {
      const cliente = clientes.find(cliente => cliente.id === parseInt(id));
      if (cliente) {
        setFormData({ name: cliente.name, email: cliente.email, phone: cliente.phone });
      }
    }
  }, [id, clientes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    const clienteActualizado: Cliente = { id: parseInt(id!), name: formData.name, email: formData.email, phone: formData.phone };
    onUpdateCliente(clienteActualizado);
    navigate("/clientes");
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="w-100 max-w-md p-4 bg-white rounded shadow-lg">
        <h2 className="text-center mb-4 text-dark">Editar Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Teléfono:</label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default ClientesEdit;
