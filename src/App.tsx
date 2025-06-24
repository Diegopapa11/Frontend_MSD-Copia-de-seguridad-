import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import ClientesList from "./assets/Components/Clientes/ClientesList";
import ClientesAdd from "./assets/Components/Clientes/ClientesAdd";
import ClientesEdit from "./assets/Components/Clientes/ClientesEdit";
import POS from "./assets/Components/Punto de venta/POS";
import Ticket from "./assets/Components/Punto de venta/Ticket";
import Login from "./assets/Components/Login/Login";
import Registro from "./assets/Components/Registro/Registro";
import EmpleadosForm from "./assets/Components/Empledados/EmpleadosForm";
import EmpleadoTable from "./assets/Components/Empledados/EmpleadoTable";
import ProductoVista from "./assets/Components/productos/ProductoVista";
import ProductoAgregar from "./assets/Components/productos/ProductoAgregar";
import OnlineStore from "./assets/Components/ProductMain/OnlineStore";
import ReporteVentas from "./assets/Components/Ventas/ReporteVentas";
import { Employee, Product, Cliente, Venta } from "./interfaces/types";
import Dashboard from "./assets/Components/Dashboard/Dashboard";
import VentasAdd from "./assets/Components/Ventas/VentasAdd";
import VentasEdit from "./assets/Components/Ventas/VentasEdit";
import VentasList from "./assets/Components/Ventas/VentasList";
import VentasPOS from "./assets/Components/Punto de venta/VentasPOS";
import Navbar from "./assets/Components/Navbar";
import EmpleadoAdmin from "./assets/Components/Empledados/EmpleadoAdmin";
import './App.css';

const App: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const storedClientes = localStorage.getItem("clientes");
    return storedClientes ? JSON.parse(storedClientes) : [];
  });
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem("products");
    return storedProducts ? JSON.parse(storedProducts) : [];
  });
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const storedEmployees = localStorage.getItem("employees");
    return storedEmployees ? JSON.parse(storedEmployees) : [];
  });
  useEffect(() => {
    const storedVentas = localStorage.getItem("ventas");
    if (storedVentas) {
      setVentas(JSON.parse(storedVentas));
    }
  }, []);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const handleAddButtonClick = () => {
    navigate("/agregar-cliente");
  };

  const handleAddCliente = (cliente: Cliente) => {
    // Validar que tenga las propiedades requeridas
    if (!cliente.name || !cliente.phone) {
      console.error("Faltan propiedades requeridas en el cliente");
      return;
    }
  
    setClientes((prevClientes) => {
      const updatedClientes = [...prevClientes, cliente];
      localStorage.setItem("clientes", JSON.stringify(updatedClientes));
      return updatedClientes;
    });
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleEditCliente = (cliente: Cliente) => {
    navigate(`/clientes/edit/${cliente.id}`);
  };

  const handleDeleteCliente = (id: number) => {
    const updatedClientes = clientes.filter(cliente => cliente.id !== id);
    setClientes(updatedClientes);
    localStorage.setItem("clientes", JSON.stringify(updatedClientes));
  };

  const handleAddVenta = (venta: Venta) => {
    setVentas([...ventas, venta]);
  };

  const handleUpdateVenta = (venta: Venta) => {
    const updatedVentas = ventas.map(v => v.id === venta.id ? venta : v);
    setVentas(updatedVentas);
  };

  const handleProductSubmit = (product: Product) => {
    if (product.id) {
      setProducts(prevProducts => {
        const updatedProducts = prevProducts.map(p =>
          p.id === product.id ? product : p
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        return updatedProducts;
      });
    } else {
      setProducts(prevProducts => {
        const updatedProducts = [...prevProducts, { ...product, id: products.length + 1 }];
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        return updatedProducts;
      });
    }
    navigate("/productos");
  };

  const handleEditProduct = (id: number) => {
    const productToEdit = products.find(product => product.id === id);
    if (productToEdit) {
      navigate("/agregar-producto", { state: { product: productToEdit } });
    }
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleEmployeeSubmit = (employee: Omit<Employee, 'id' | 'role'>, id?: number) => {
    if (id) {
      setEmployees(prevEmployees => {
        const updatedEmployees = prevEmployees.map(emp =>
          emp.id === id ? { ...emp, ...employee, role: emp.role } : emp
        );
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
        return updatedEmployees;
      });
    } else {
      const newEmployee: Employee = {
        ...employee,
        id: employees.length + 1,
        role: "Empleado",
      };
      setEmployees(prevEmployees => {
        const updatedEmployees = [...prevEmployees, newEmployee];
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
        return updatedEmployees;
      });
    }
    navigate("/empleadosTable");
  };

  useEffect(() => {
    // Ya no es necesario el fetch, solo cargar desde localStorage
    const storedClientes = localStorage.getItem('clientes');
    if (storedClientes) {
      setClientes(JSON.parse(storedClientes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  return (
    <div className="">
      <Navbar />

      <div className="flex-grow-1 d-flex flex-column">
        <div className="p-4">
          {showSuccessAlert && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              Cliente agregado exitosamente!
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowSuccessAlert(false)}
              ></button>
            </div>
          )}
          
          <Routes>
            <Route
              path="/clientes"
              element={(
                <div className="card shadow-lg">
                  <div className="card-body">
                    <div className="encabezado">
                      <h2 className="section-title">Gestión de Clientes</h2>
                      <button
                        type="button"
                        className="add-product-btn"
                        onClick={handleAddButtonClick}
                      >
                        Agregar Cliente
                      </button> 
                    </div>
                    
                    <ClientesList
                      clientes={clientes}
                      onDeleteCliente={handleDeleteCliente}
                      onEditCliente={handleEditCliente}
                    />
                  </div>
                </div>
              )}
            />
            
            <Route
              path="/agregar-cliente"
              element={(
                <ClientesAdd
                  onAddCliente={(cliente) => {
                    handleAddCliente(cliente);
                    setTimeout(() => navigate("/clientes"), 1500);
                  }}
                  onClose={() => navigate("/clientes")}
                />
              )}
            />
            
            <Route path="/pos" element={<POS />} />
            <Route path="/tienda" element={<OnlineStore products={products} selectedProduct={null} onProductSelect={(product) => { console.log('Producto seleccionado:', product); }} />} />
            <Route
              path="/inventario"
              element={(
                <ProductoVista 
                  products={products} 
                  onEdit={handleEditProduct} 
                  onDelete={handleDeleteProduct} 
                />
              )}
            />
            <Route
              path="/agregar-producto"
              element={(
                <ProductoAgregar 
                  onSubmit={handleProductSubmit} 
                  onClose={() => navigate("/productos")} 
                />
              )}
            />
            <Route
              path="/empleadosForm/:id?"
              element={(
                <EmpleadosForm 
                  employees={employees} 
                  onSubmit={handleEmployeeSubmit} 
                />
              )}
            />
            <Route 
              path="/empleadosTable" 
              element={(
                <EmpleadoTable 
                  employees={employees} 
                  onEdit={(id: number) => navigate(`/empleadosForm/${id}`)} 
                  onDelete={(id: number) => {
                    const updatedEmployees = employees.filter(emp => emp.id !== id);
                    setEmployees(updatedEmployees);
                    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
                  }} 
                />
              )} 
            />
            <Route 
              path="/clientes/edit/:id" 
              element={(
                <ClientesEdit 
                  clientes={clientes} 
                  onUpdateCliente={handleAddCliente}
                />
              )}
            />
            <Route 
              path="/reporte-empleados" 
              element={<ReporteVentas ventas={ventas} empleados={employees} />} 
            />
            <Route path="/ventas/add" element={(
              <VentasPOS 
                onAddVenta={handleAddVenta}
                empleados={employees}
                clientes={clientes}
                products={products}
                empleadoAutenticado={JSON.parse(localStorage.getItem("usuarioAutenticado") || "{}")}
              />
            )} />
            <Route path="/admin/empleado/:id" element={<EmpleadoAdmin ventas={ventas} empleados={employees}/>} />
            <Route path="/ventas" element={<VentasList ventas={ventas} />} />
            <Route path="/ventasadd" element={<VentasAdd onAddVenta={handleAddVenta} empleados={employees} clientes={clientes} />} />
            <Route path="/ventas/edit/:id" element={<VentasEdit ventas={ventas} onUpdateVenta={handleUpdateVenta} />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/login" element={<Login empleados={employees} />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
