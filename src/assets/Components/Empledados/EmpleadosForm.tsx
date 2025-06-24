import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Employee } from "../../../interfaces/types";
import "bootstrap/dist/css/bootstrap.min.css";

interface EmpleadosFormProps {
  onSubmit: (employee: Omit<Employee, 'id'>, id?: number) => void;
  employees: Employee[];
}

const EmpleadosForm: React.FC<EmpleadosFormProps> = ({ onSubmit, employees }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const employeeToEdit = employees.find(emp => emp.id === Number(id));

  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({ 
    name: employeeToEdit?.name || "",
    email: employeeToEdit?.email || "",
    joiningDate: employeeToEdit?.joiningDate || "",
    image: employeeToEdit?.image || "",
    password: employeeToEdit?.password || "", // Añadido campo password
    role: employeeToEdit?.role || "Empleado" // Añadido campo role con valor por defecto
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, employeeToEdit ? employeeToEdit.id : undefined);
    navigate("/empleadosTable");
  };

  return (
    <div className="container mt-4">
      <form className="row align-items-center card p-4 shadow" onSubmit={handleSubmit}>
        <h2 className="text-center">{employeeToEdit ? "Editar Empleado" : "Agregar Empleado"}</h2>

        <div className="col-10 mb-3 d-flex">
          <div className="col-4">
            <label htmlFor="form-nombre">Nombre</label>
          </div>
          <div className="col-8">
            <input id="form-nombre" className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
        </div>

        <div className="col-10 mb-4 d-flex">
          <div className="col-4">
            <label htmlFor="form-email">Email</label>
          </div>
          <div className="col-8">
            <input id="form-email" className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="col-10 mb-3 d-flex">
          <div className="col-4">
            <label htmlFor="form-password">Contraseña</label>
          </div>
          <div className="col-8">
            <input 
              id="form-password" 
              className="form-control" 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder={employeeToEdit ? "Dejar en blanco para no cambiar" : ""}
            />
          </div>
        </div>

        <div className="col-10 mb-3 d-flex">
          <div className="col-4">
            <label htmlFor="form-role">Rol</label>
          </div>
          <div className="col-8">
            <select
              id="form-role"
              className="form-control"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as "Administrador" | "Empleado"})}
              required
            >
              <option value="Administrador">Administrador</option>
              <option value="Empleado">Empleado</option>
            </select>
          </div>
        </div>

        <div className="col-10 mb-3 d-flex">
          <div className="col-4">
            <label htmlFor="form-joiningDate">Fecha de Ingreso</label>
          </div>
          <div className="col-8">
            <input className="form-control" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="col-10 mb-3 d-flex">
          <div className="col-4">
            <label htmlFor="form-image">Imagen</label>
          </div>
          <div className="col-8">
            <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        {formData.image && (
          <div className="text-center mb-3">
            <p>Vista previa:</p>
            <img src={formData.image} alt="Vista previa" className="rounded" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
          </div>
        )}

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">{employeeToEdit ? "Actualizar" : "Agregar"}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/empleadosTable")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EmpleadosForm;