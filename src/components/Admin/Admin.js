import { useEffect, useState } from 'react'
import './Admin.css';
import Validar from '../Validar/Validar.js'
// import CrearFecha from '../CrearFecha/CrearFecha.js'

const Admin = () => {

    const [eleccion, setEleccion] = useState(null)

    useEffect(() => {

    }, [])

    return (
        <>
            <h1 className='GestorTitle'>Cintas Sueltas panel de administracion</h1>
            <div className='ContHome'>
                <button onClick={() => setEleccion("validar")} className="btn btn-primary">Validar entrada</button>
                <button onClick={() => setEleccion("crearfecha")} className="btn btn-primary">Crear fecha</button>
            </div>

            {eleccion === "validar" && <Validar/>}
            {/* {eleccion === "crearfecha" && <CrearFecha/>} */}
        </>
    )   
}

export default Admin;