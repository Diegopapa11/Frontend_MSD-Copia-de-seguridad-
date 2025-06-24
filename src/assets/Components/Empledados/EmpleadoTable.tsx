import React from 'react';
import { Employee } from "../../../interfaces/types";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "../productos/ProductoVista.css"

interface EmpleadoTableProps {
  employees: Employee[];
  onEdit: (id: number) => void; 
  onDelete: (id: number) => void;
}

const EmpleadoTable: React.FC<EmpleadoTableProps> = ({ employees, onDelete }) => {
  const navigate = useNavigate();

  const handleEditClick = (id: number) => {
    navigate(`/empleadosForm/${id}`);
  };

  const handleAddEmpleadoClick = () => {
    navigate('/empleadosForm'); // Redirige a EmpleadosForm para agregar un nuevo empleado
  };

  return (
    <div> 
      <div className='encabezado'>
        <button className="add-product-btn" onClick={handleAddEmpleadoClick}>
          Agregar Empleado
        </button>
        <h2 className='section-title'>Lista de Empleados</h2>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Fecha de Ingreso</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.joiningDate}</td>
              <td>
                {employee.image ? (
                  <img src={employee.image} alt={employee.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                ) : (
                  <span>No disponible</span>
                )}
              </td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEditClick(employee.id)}>Editar</button> <p/>
                <button  className="btn btn-danger me-2" onClick={() => onDelete(employee.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpleadoTable;
