import React from "react";
import { Product } from "../../../interfaces/types";
import "./ProductList.css"

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded">
          <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2" />
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
          <p className="text-gray-600">${product.stock}</p>
          <p className="text-sm">{product.description}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(product)}
              className="bg-yellow-500 text-black px-3 py-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(product.id)} // Llama a onDelete con el id del producto
              className="bg-red-500 text-black px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;