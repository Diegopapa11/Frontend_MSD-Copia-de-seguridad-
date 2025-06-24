export const getData = <T>(key: string): T[] => {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const saveData = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Funciones específicas para cada entidad
export const addCliente = (cliente: any) => {
  const clientes = getData<any>("clientes");
  clientes.push(cliente);
  saveData("clientes", clientes);
};

export const addVenta = (venta: any) => {
  const ventas = getData<any>("ventas");
  ventas.push(venta);
  saveData("ventas", ventas);
};

export const addDetalleVenta = (detalle: any) => {
  const detalles = getData<any>("detallesVenta");
  detalles.push(detalle);
  saveData("detallesVenta", detalles);
};

// Función para guardar los datos del ticket en sessionStorage
   