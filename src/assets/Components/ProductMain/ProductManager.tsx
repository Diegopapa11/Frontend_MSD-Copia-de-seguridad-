import React, { useState } from "react";
import ProductList from "./ProductList";
import { Product } from "../../../interfaces/types";

type ProductManagerProps = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

const ProductManager: React.FC<ProductManagerProps> = ({ products, setProducts }) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    stock: 0,
    image: "",
    description: ""
  });

  // Manejo de cambios en inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: name === "price" ? parseFloat(value) : value });
  };

  // Convertir imagen a Base64 y guardarla
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string }); // Guardamos la imagen en Base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Agregar producto
  const addProduct = () => {
    const updatedProducts = [...products, { ...newProduct, id: products.length + 1 }];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts)); // Guardamos en localStorage
    setShowForm(false);
    setNewProduct({ id: 0, name: "", price: 0, stock: 0, image: "", description: "" });
  };

  // Editar producto
  const editProduct = (product: Product) => {
    setIsEditing(true);
    setCurrentProductId(product.id);
    setNewProduct(product);
    setShowForm(true);
  };

  // Actualizar producto
  const updateProduct = () => {
    const updatedProducts = products.map((product) =>
      product.id === currentProductId ? { ...newProduct, id: currentProductId } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts)); // Guardamos en localStorage
    setShowForm(false);
    setIsEditing(false);
    setNewProduct({ id: 0, name: "", price: 0, stock: 0, image: "", description: "" });
    setCurrentProductId(null);
  };

  // Eliminar producto
  const deleteProduct = (productId: number) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts)); // Guardamos en localStorage
  };

  return (
    <div className="relative min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
      <ProductList products={products} onEdit={editProduct} onDelete={deleteProduct} />

      {/* Botón flotante */}
      <button
        onClick={() => {
          setShowForm(true);
          setIsEditing(false);
          setNewProduct({ id: 0, name: "", price: 0, stock: 0, image: "", description: "" });
        }}
        className="btn-add fixed bottom-6 right-6 bg-blue-500 text-black px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        + Agregar Producto
      </button>

      {/* Modal para agregar/editar producto */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/2">
            <h2 className="text-lg font-bold mb-4">{isEditing ? "Editar Producto" : "Nuevo Producto"}</h2>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={newProduct.name}
              onChange={handleInputChange}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={newProduct.price}
              onChange={handleInputChange}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={newProduct.price}
              onChange={handleInputChange}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              name="description"
              placeholder="Descripción"
              value={newProduct.description}
              onChange={handleInputChange}
              className="border p-2 rounded w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
              <button onClick={isEditing ? updateProduct : addProduct} className="bg-blue-500 text-white px-4 py-2 rounded">
                {isEditing ? "Actualizar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;