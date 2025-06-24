import { useState, FormEvent } from 'react';
import "./Registro.css";

function Registro() {
  const [nombre, setNombre] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [registroExitoso, setRegistroExitoso] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegistroExitoso(true);
    setNombre("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="registro-container">
      <h2>Registro</h2>
      {registroExitoso ? (
        <p className="success-message">Registro exitoso!</p>
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
        </form>
      )}
    </div>
  );
}

export default Registro;