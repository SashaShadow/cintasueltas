import { useEffect, useState } from 'react'
import './Home.css';
import Validar from '../Validar/Validar.js'
import CrearEntrada from '../CrearEntrada/CrearEntrada.js'

const Home = () => {

    const [eleccion, setEleccion] = useState(null)

    useEffect(() => {
        console.log("buscar fechas")
    }, [])

    return (
        <>
            <h1 className='GestorTitle'>Cintas Sueltas</h1>
            <div className='ContHome'>
                <button onClick={() => setEleccion("validar")} className="btn btn-primary">Validar entrada</button>
                <button onClick={() => setEleccion("crearfecha")} className="btn btn-primary">Crear fecha</button>
            </div>

            {eleccion === "validar" && <Validar/>}
            {eleccion === "crearfecha" && <CrearEntrada/>}
        </>
    )   
}

export default Admin;