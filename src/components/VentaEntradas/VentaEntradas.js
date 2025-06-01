import { useContext, useEffect, useState } from 'react'
import './VentaEntradas.css';
import axios from 'axios';
import { backendEnd } from '../../utils/urls.js';
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Context from '../../context/SessionContext.js';

const VentaEntradas = () => {

    const [errorAlert, setErrorAlert] = useState(null)
    const [fechas, setFechas] = useState(null)
    const [fecha, setFecha] = useState(null)
    const [tickets, setTickets] = useState(null)
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate();
    const { user } = useContext(Context);

    useEffect(() => {
      if (!user) {
        navigate("/login")
      }
    }, [user])

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

    const buscarTicketsVendidos = async (fecha) => {
        try {
            let id_fecha = fecha._id
            setLoader(true)
            const getTickets = await axios.get(`${backendEnd}tickets/byfecha/${id_fecha}/`)

            if (getTickets.data.status_code !== 200) {
                setTickets([])
                setFecha(fecha)
            } else {
                setTickets(getTickets.data.data)
                setFecha(fecha)
            }
        } catch (err) {
            setErrorAlert(err.toString()) 
        } finally {
            setLoader(false)
        }
    }

    const volverListado = () => {
        setTickets(null)
        setFecha(null)
    }

    return (
        <>
            <h2 className='GestorTitle'>Progreso de venta de entradas</h2>
            
            <div className='ContHome'>
                {loader && <h2 className='Loader'>Cargando...</h2>}
                {errorAlert && 
                <>
                <h2 className='blanco'>Error: {errorAlert}</h2>
                </>}
                {fechas && fechas.length > 0 && !tickets &&
                <div className='ContFechas'>
                    {fechas.map((fech, i) => {
                        return ( 
                            <div key={i} className='FechaIndCont' onClick={() => buscarTicketsVendidos(fech)}>
                                <img className='ImgFecha' src={`${fech.imagen_url}`} alt={`${fech.nombre_evento}}`}/>
                                <div className='UbiFecha'>
                                    <IoLocationSharp className='iconCustom'/>
                                    <p>{fech.nombre_lugar}</p>
                                </div>
                                <p className='NombreFecha'>{fech.nombre_evento}</p>
                                <div className='FechaHora'>
                                    <p>{fech.fecha}</p>
                                    <p>|</p>
                                    <p>{fech.hora}HS</p>
                                </div>

                            </div>
                        )
                    })}
                </div>
                }

                {tickets && fecha &&
                <div className='ContEntradasVendidas'>
                    <button className='btn' onClick={() => volverListado()}>Volver a listado de fechas</button>
                    <h3>Entradas vendidas para el {fecha.nombre_evento}</h3>
                    <h4>Total de entradas vendidas: {tickets.reduce((sum, ticket) => sum + ticket.cantidad, 0)}</h4>
                    <table className="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Nombre y apellido</th>
                            <th scope="col">Email</th>
                            <th scope="col">Cantidad de entradas</th>
                            <th scope="col">Importe abonado</th>
                            <th scope="col">Fecha de compra</th>
                            <th scope="col">Id. de pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((tic, i) => {
                            return (
                            <tr key={i}>
                                <th scope="row">{tic.nombre}</th>
                                <td>{tic.email}</td>
                                <td>{tic.cantidad}</td>
                                <td>{tic.importe_total}</td>
                                <td>{tic.fecha}</td>
                                <td>{tic.id_pago}</td>
                            </tr>
                            )
                        })}
                    </tbody>
                    </table>
                </div>
                }
            </div>
        </>
    )   
}

export default VentaEntradas;