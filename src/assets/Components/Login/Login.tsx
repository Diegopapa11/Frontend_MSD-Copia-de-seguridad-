import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Employee } from "../../../interfaces/types";

interface LoginProps {
  empleados: Employee[];
}

function Login({ empleados }: LoginProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validación básica
    if (!formData.email || !formData.password) {
      setError("Por favor complete todos los campos");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Suponiendo que el backend regresa un token y datos de usuario:
      const { user, token } = data;

      localStorage.setItem("usuarioAutenticado", JSON.stringify(user));
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al iniciar sesión");
    } finally {
        setIsLoading(false);
      }
    };

  const handleRegistro = () => {
    navigate("/registro");
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="user@example.com"
            autoComplete="username"
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="********"
            autoComplete="current-password"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button 
          type="submit" 
          disabled={isLoading}
          className={isLoading ? "loading" : ""}
        >
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
      <button 
        onClick={handleRegistro}
        className="secondary-button"
      >
        Registrarse
      </button>
    </div>
  );
}

export default Login;
