import React, { useState } from "react";
import { Product } from "../../../interfaces/types";

interface OnlineStoreProps {
  products: Product[];
  selectedProduct: number | null;
  onProductSelect: (product: Product) => void; // Se pasa al componente padre para actualizar los productos seleccionados
}

const OnlineStore: React.FC<OnlineStoreProps> = ({ products, onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para manejar el filtro de búsqueda

  // Filtrar productos por nombre
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fluid-container align-items-center">
      <h4 className="mb-3">Selecciona productos</h4>

      {/* Campo de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
        />
      </div>

      {/* Mostrar los productos filtrados en un formato de cards */}
      <div className="row align-items-center">
        {filteredProducts.map((product) => (
          <div key={product.id} className="col-md-5 mb-2">
            <div className="card shadow-sm" style={{ fontSize: '12px' }}>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                  style={{ maxHeight: "100px", objectFit: "contain" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Precio: ${product.price}</p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => onProductSelect(product)}
                >
                  Seleccionar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineStore;