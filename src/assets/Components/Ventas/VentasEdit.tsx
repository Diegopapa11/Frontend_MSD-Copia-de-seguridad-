import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Venta } from '../../../interfaces/types';

interface VentasEditProps {
  ventas: Venta[];
  onUpdateVenta: (venta: Venta) => void;
}

const VentasEdit: React.FC<VentasEditProps> = ({ ventas, onUpdateVenta }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ventaEditada, setVentaEditada] = useState<Venta | null>(null);

  useEffect(() => {
    // Buscar la venta a editar cuando el componente se monta o cambia el id
    const venta = ventas.find(v => v.id === Number(id));
    if (venta) {
      setVentaEditada(venta);
    } else {
      navigate('/ventas'); // Redirigir si no se encuentra la venta
    }
  }, [id, ventas, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ventaEditada) {
      onUpdateVenta(ventaEditada); // Usamos la prop callback para actualizar
      navigate('/ventas'); // Redirigir después de actualizar
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (ventaEditada) {
      setVentaEditada({
        ...ventaEditada,
        [e.target.name]: e.target.value
      });
    }
  };

  if (!ventaEditada) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Editar Venta</h2>
      <form onSubmit={handleSubmit}>
        {/* Aquí tus campos del formulario */}
        <div className="mb-3">
          <label className="form-label">Cliente</label>
          <input
            type="text"
            className="form-control"
            name="cliente"
            value={ventaEditada.cliente || ''}
            onChange={handleChange}
          />
        </div>
        
        {/* Más campos según tu modelo Venta */}
        
        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
        <button 
          type="button" 
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/ventas')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default VentasEdit;