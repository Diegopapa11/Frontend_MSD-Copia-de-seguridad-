import React from "react";
import { Product } from "../../../interfaces/types";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Imagen</th>
            <th className="py-2 px-4 border-b text-left">Nombre</th>
            <th className="py-2 px-4 border-b text-left">Precio</th>
            <th className="py-2 px-4 border-b text-left">Stock</th>
            <th className="py-2 px-4 border-b text-left">Descripción</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b w-1 h-1">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-100 h-100 object-cover rounded border"
                />
              </td>

              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b text-green-600 font-bold">
                ${product.price.toFixed(2)}
              </td>
              <td className="py-2 px-4 border-b truncate max-w-xs">{product.stock}</td>
              <td className="py-2 px-4 border-b truncate max-w-xs">{product.description}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;