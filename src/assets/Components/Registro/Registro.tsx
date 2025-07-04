import { useState, FormEvent } from 'react';
import "./Registro.css";

function Registro() {
  const [nombre, setNombre] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [registroExitoso, setRegistroExitoso] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Limpiar errores anteriores

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        setRegistroExitoso(true);
        setNombre("");
        setEmail("");
        setPassword("");
      } else {
        const data = await response.json();
        setError(data.message || "Error al registrar");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro</h2>
      {registroExitoso ? (
        <p className="success-message">¡Registro exitoso!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Registrarse</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </div>
  );
}

export default Registro;
