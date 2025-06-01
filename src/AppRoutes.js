import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.js';
import Home from './components/Home/Home.js';
import Login from './components/Login/Login.js';
import Start from './components/Start/Start.js';
import Validar from './components/Validar/Validar.js';
import CrearFecha from './components/CrearFecha/CrearFecha.js';
import Fecha from './components/Fecha/Fecha.js';
import VentaEntradas from './components/VentaEntradas/VentaEntradas.js';
import Error from './components/Error/Error.js';
import Exito from './components/Exito/Exito.js';
import Footer from "./components/Footer/Footer.js"; 

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbarOnRoutes = ['/'];
  const showNavbar = !hideNavbarOnRoutes.includes(location.pathname);

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <main className='MainContent' style={{ flexGrow: 1 }}>
        <Routes>
          <Route path='/' element={<Start />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/validar' element={<Validar />} />
          <Route path='/crearfecha' element={<CrearFecha fechaEditar={null} setFechaEditar={null}/>} />
          <Route path='/fecha/:id' element={<Fecha/>} />
          <Route path='/vtaentradas' element={<VentaEntradas/>} />
          <Route path='/success' element={<Exito/>} />
          <Route path='/error' element={<Error/>} />
          <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
      </main>
      {showNavbar && <Footer />}
    </div>
  );
};

export default AppRoutes;
