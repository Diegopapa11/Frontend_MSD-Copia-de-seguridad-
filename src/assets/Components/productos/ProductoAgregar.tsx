import { useLocation, useNavigate } from "react-router-dom";
import { Product } from "../../../interfaces/types";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductoAgregar: React.FC<{ onSubmit: (product: Product) => void; onClose: () => void }> = ({
  onSubmit,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const productToEdit: Product | undefined = location.state?.product;

  const [product, setProduct] = useState<Omit<Product, "image"> & { image: File | null }>({
    id: productToEdit?.id ?? 0,
    name: productToEdit?.name ?? "",
    price: productToEdit?.price ?? 0,
    stock: productToEdit?.stock ?? 0,
    description: productToEdit?.description ?? "",
    image: null,
  });

  // Manejar cambios en los inputs de texto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Manejar la selección del archivo de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProduct((prevProduct) => ({
      ...prevProduct,
      image: file,
    }));
  };

  // Convertir la imagen a Base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageBase64 = "";
    if (product.image instanceof File) {
      imageBase64 = await convertImageToBase64(product.image);
    }

    const updatedProduct: Product = {
      ...product,
      image: imageBase64,
    };

    onSubmit(updatedProduct);
    navigate("/inventario");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">{productToEdit ? "Editar Producto" : "Agregar Producto"}</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Nombre del Producto:</label>
          <input type="text" className="form-control" name="name" value={product.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio:</label>
          <input type="number" className="form-control" name="price" value={product.price} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock:</label>
          <input type="number" className="form-control" name="stock" value={product.stock} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción:</label>
          <input type="text" className="form-control" name="description" value={product.description} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen:</label>
          <input type="file" className="form-control" name="image" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            {productToEdit ? "Actualizar" : "Agregar"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductoAgregar;