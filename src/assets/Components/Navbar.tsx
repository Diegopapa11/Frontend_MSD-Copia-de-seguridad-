import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaUserTie, FaSignInAlt, FaChartBar, FaUsers } from 'react-icons/fa';
import logo from '../../../src/assets/imagenes/logo1.png'; 
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('usuarioAutenticado');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="sidebar vh-100">
      <div className="sidebar-sticky">
        {/* Mostrar la imagen en lugar del texto */}
        <div className="text-center py-3">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link align-items-center">
              <FaHome className="me-2" /> Home
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/inventario" className="nav-link align-items-center">
              <FaBoxOpen className="me-2" /> Inventario
            </Link>
          </li>

          {usuarioAutenticado.rol === 'admin' && (
            <li className="nav-item">
              <Link to="/reporte-empleados" className="nav-link align-items-center">
                <FaChartBar className="me-2" /> Reporte de Empleados
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link to="/ventas" className="nav-link align-items-center">
              <FaBoxOpen className="me-2" /> Ventas
            </Link>
          </li>

          {usuarioAutenticado.rol === 'admin' && (
            <li className="nav-item">
              <Link to="/empleadosTable" className="nav-link align-items-center">
                <FaUserTie className="me-2" /> Empleados
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link to="/clientes" className="nav-link align-items-center">
              <FaUsers className="me-2" /> Clientes
            </Link>
          </li>

          {usuarioAutenticado && usuarioAutenticado.rol ? (
            <li className="nav-item">
              <button 
                onClick={handleLogout}
                className="nav-link bg-transparent align-items-center w-100"
              >
                <FaSignInAlt className="me-2" /> Cerrar Sesión
              </button>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link align-items-center">
                <FaSignInAlt className="me-2" /> Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
