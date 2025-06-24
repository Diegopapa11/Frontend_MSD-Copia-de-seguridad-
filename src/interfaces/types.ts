export interface Employee {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "Administrador" | "Empleado";
  joiningDate: string;
  image?: string;
}

  export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    description: string;
    image: string;
  }

  export interface Usuario {
    id: number;
    user: string;
    email: string;
    password: string;
    rol: 'admin' | 'employee';
  }

  export interface Cliente {
    id: number;
    name: string;
    email: string;
    phone: string;
  }

  export interface Venta {
    id: number;
    fecha: string;
    productos: Array<{
      id: number;
      nombre: string;
      cantidad: number;
      precio: number;
    }>;
    total: number;
    empleado: string; // ID del empleado como string
    empleadoNombre: string; // Nombre del empleado para fácil acceso
    cliente: string;
    metodoPago: string;
    montoRecibido: number;
    tarjetaNumero?: string;
  }
  
  export interface DetalleVenta {
    id: number;
    empleado: string;
    fecha: string;
    monto: number;
  }
