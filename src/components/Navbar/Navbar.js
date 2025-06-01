import { useState, useContext } from 'react';
import Context from '../../context/SessionContext.js';
import './Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, setUser } = useContext(Context);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="MyNav">
        <img
          src="/LOGO.PNG"
          onClick={() => navigate("/")}
          className="LogoNavBar"
          alt="logo"
        />

        <div className="Hamburger" onClick={() => setSidebarOpen(true)}>
          ☰
        </div>

        <div className="SeccionPersonas">
          <NavLink to={`/home`}>
            <p className='HomeBut'>Home</p>
          </NavLink>
        </div>

        <div className="SeccionAdm">
          {user ? (
            <>
              <p>{user.username}</p>
              <NavLink to={`/crearfecha`}><p className='Username'>Crear fecha</p></NavLink>
              <NavLink to={`/validar`}><p className='Username'>Validar entradas</p></NavLink>
              <NavLink to={`/vtaentradas`}><p className='Username'>Venta de entradas</p></NavLink>
              <p className='Username' onClick={() => setUser(null)}>Cerrar sesión</p>
            </>
          ) : (
            <NavLink to={`/login`}>
              <p className='HomeButAdm'>Iniciar sesión</p>
            </NavLink>
          )}
        </div>
      </nav>

      <div className={`Sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="SidebarHeader">
          <span onClick={() => setSidebarOpen(false)} className="CloseBtn">×</span>
        </div>
        <div className="SidebarContent">
          <NavLink to={`/home`} onClick={() => setSidebarOpen(false)}><p className='SidebarLink'>Home</p></NavLink>

          {user ? (
            <>
              <p className='SidebarLink'>{user.username}</p>
              <NavLink to={`/crearfecha`} onClick={() => setSidebarOpen(false)}><p className='SidebarLink'>Crear fecha</p></NavLink>
              <NavLink to={`/validar`} onClick={() => setSidebarOpen(false)}><p className='SidebarLink'>Validar entradas</p></NavLink>
              <NavLink to={`/vtaentradas`} onClick={() => setSidebarOpen(false)}><p className='SidebarLink'>Venta de entradas</p></NavLink>
              <p className='SidebarLink' onClick={() => { setUser(null); setSidebarOpen(false); }}>Cerrar sesión</p>
            </>
          ) : (
            <NavLink to={`/login`} onClick={() => setSidebarOpen(false)}><p className='SidebarLink'>Iniciar sesión</p></NavLink>
          )}
          <img
            src="/LOGO.PNG"
            onClick={() => navigate("/")}
            className="LogoSideBar"
            alt="logo"
          />
        </div>
      </div>

      {/* Overlay para cerrar sidebar */}
      {sidebarOpen && <div className="SidebarOverlay" onClick={() => setSidebarOpen(false)} />}
    </>
  );
};

export default Navbar;
