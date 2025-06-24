import React from "react";
import { useNavigate } from "react-router-dom";
import { Cliente } from "../../../interfaces/types";

interface ClientesListProps {
  clientes: Cliente[];
  onDeleteCliente: (id: number) => void;
  onEditCliente: (cliente: Cliente) => void;
}

const ClientesList: React.FC<ClientesListProps> = ({ clientes, onDeleteCliente }) => {
  const navigate = useNavigate();

  const handleEditCliente = (cliente: Cliente) => {
    navigate(`/clientes/edit/${cliente.id}`);
  };

  return (
    <div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.name}</td>  {/* Cambiado de cliente.nombre a cliente.name */}
              <td>{cliente.email}</td>
              <td>
                <button className="btn-blue" onClick={() => handleEditCliente(cliente)}>Editar</button> <p/>
                <button className="btn btn-warning" onClick={() => onDeleteCliente(cliente.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientesList;
