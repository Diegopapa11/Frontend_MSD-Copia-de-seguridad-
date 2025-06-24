import { useState } from "react";
import { getData, saveData } from "../utils/localStorage"; // Puedes organizar las funciones como utilidades

export const useClientes = () => {
  const clientes = getData<any>("clientes");

  const addCliente = (cliente: any) => {
    clientes.push(cliente);
    saveData("clientes", clientes);
  };

  const updateCliente = (updatedCliente: any) => {
    const updatedClientes = clientes.map(cliente =>
      cliente.id === updatedCliente.id ? updatedCliente : cliente
    );
    saveData("clientes", updatedClientes);
  };

  const deleteCliente = (id: number) => {
    const updatedClientes = clientes.filter(cliente => cliente.id !== id);
    saveData("clientes", updatedClientes);
  };

  return { clientes, addCliente, updateCliente, deleteCliente };
};

export const useProducts = () => {
  const products = getData<any>("products");

  const addOrUpdateProduct = (product: any) => {
    if (product.id) {
      const updatedProducts = products.map(p =>
        p.id === product.id ? product : p
      );
      saveData("products", updatedProducts);
    } else {
      product.id = products.length + 1;
      products.push(product);
      saveData("products", products);
    }
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    saveData("products", updatedProducts);
  };

  return { products, addOrUpdateProduct, deleteProduct };
};

export const useEmployees = () => {
    const [employees, setEmployees] = useState<any[]>(() => getData<any>("empleados"));
  
    const addEmployee = (employee: any) => {
      const updatedEmployees = [...employees, employee];
      saveData("empleados", updatedEmployees);
      setEmployees(updatedEmployees);
    };
  
    const deleteEmployee = (id: number) => {
      const updatedEmployees = employees.filter((emp: any) => emp.id !== id);
      saveData("empleados", updatedEmployees);
      setEmployees(updatedEmployees);
    };
  
    return { employees, addEmployee, deleteEmployee };
  };