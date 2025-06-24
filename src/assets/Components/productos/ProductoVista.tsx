import { Product } from "../../../interfaces/types";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductoVista.css";

const ProductoVista: React.FC<{ products: Product[]; onEdit: (id: number) => void; onDelete: (id: number) => void }> = ({
  products,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="container  mt-5">
        <div className="encabezado">
            <button className="add-product-btn" onClick={() => navigate("/agregar-producto")}>
              Agregar Producto
            </button>
          <h2 className="section-title">Inventario</h2>
        </div>

      <table className="custom-table table-striped table-bordered">
        <thead className="thead">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>{product.description}</td>
              <td>
                {product.image && <img src={product.image} alt={product.name} width="100" />}
              </td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => onEdit(product.id)}>
                  Editar
                </button><p/>
                <button className="btn btn-danger" onClick={() => onDelete(product.id)}>
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

export default ProductoVista;