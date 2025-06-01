import { useEffect, useState } from 'react'
import './Home.css';
import axios from 'axios';
import { backendEnd } from '../../utils/urls.js';
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const [errorAlert, setErrorAlert] = useState(null)
    const [fechas, setFechas] = useState(null)
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const apiCalls = async () => {
            try {
                setLoader(true)
                const getFechas = await axios.get(`${backendEnd}fechas/`)
                if (getFechas.data.status_code !== 200) throw new Error("Error al traer datos de las fechas")
                
                setFechas(getFechas.data.data)
            } catch (err) {
                setErrorAlert(err.toString())
            }
            setLoader(false)

        }
        apiCalls()
    }, [])

    return (
        <>
            <div className='ContHome'>
                <h2 className='GestorTitle'>Fechas</h2>
                {loader && <h2 className='Loader'>Cargando...</h2>}
                {errorAlert && 
                <>
                <h2 className='blanco'>Error: {errorAlert}</h2>
                </>}
                {fechas && fechas.length > 0 &&
                <div className='ContFechas'>
                    {fechas.map((fecha, i) => {
                        return ( 
                            <div key={i} className='FechaIndCont' onClick={() => navigate(`/fecha/${fecha["_id"]}`)}>
                                <img className='ImgFecha' src={`${fecha.imagen_url}`} alt={`${fecha.nombre_evento}}`}/>
                                <div className='UbiFecha'>
                                    <IoLocationSharp className='iconCustom'/>
                                    <p>{fecha.nombre_lugar}</p>
                                </div>
                                <p className='NombreFecha'>{fecha.nombre_evento}</p>
                                <div className='FechaHora'>
                                    <p>{fecha.fecha}</p>
                                    <p>|</p>
                                    <p>{fecha.hora}HS</p>
                                </div>

                            </div>
                        )
                    })}
                </div>
                }
            </div>
        </>
    )   
}

export default Home;