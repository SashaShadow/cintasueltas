import { useContext, useEffect, useState } from 'react'
import './VentaEntradas.css';
import axios from 'axios';
import { backendEnd } from '../../utils/urls.js';
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Context from '../../context/SessionContext.js';
import { crearExceldeTabla } from "../../utils/crearExcelTabla.js"
import { useLocation } from 'react-router-dom';

const VentaEntradas = () => {
    const location = useLocation();
    const { pathname } = location;

    const [errorAlert, setErrorAlert] = useState(null)
    const [fechas, setFechas] = useState(null)
    const [fecha, setFecha] = useState(null)
    const [tickets, setTickets] = useState(null)
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate();
    const { user, token, setToken, setUser, validateToken } = useContext(Context);
    const [fechaUrl, setFechaUrl] = useState(null)


    const buscarTicketsVendidos = async (fecha) => {
        try {
            let id_fecha = fecha._id
            setLoader(true)
            const getTickets = await axios.get(`${backendEnd}tickets/byfecha/${id_fecha}`)

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

    useEffect(() => {
        if (!user && !fechaUrl) {
            let urlDividido = pathname.split('/')
            let fechaFound = true

            if (urlDividido.length === 3) {
                const apiCalls = async () => {
                    try {
                        setLoader(true)
                        const getFecha = await axios.get(`${backendEnd}fechas/bynewid/${urlDividido[urlDividido.length - 1]}`)
                        if (getFecha.data.status_code !== 200) throw new Error("Error al traer datos de la fecha")
                        console.log(getFecha.data.data)
                        setFechaUrl(getFecha.data.data)
                        setFecha(getFecha.data.data)
                        buscarTicketsVendidos(getFecha.data.data)
                    } catch (err) {
                        setErrorAlert(err.toString())
                        fechaFound = false
                    }
                    setLoader(false)

                }
                apiCalls()
            }

            if (!fechaFound) {
                navigate("/login")
            }
        }
    }, [user])

    useEffect(() => {
        if (token) {
            validateToken().then(isValidToken => {
                if (!isValidToken) {
                    setToken(null);
                    setUser(null);
                    navigate("/login");
                }
            });
        }
    }, [token])

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



    const volverListado = () => {
        setTickets(null)
        setFecha(null)
    }

    const parseFecha = (fechaStr) => {
        const [dia, mes, anio] = fechaStr.split('/').map(Number);
        return new Date(anio, mes - 1, dia);
    }

    const reenviarMail = async (extref) => {
        try {
            setLoader(true)
            const getReenvio = await axios.get(`${backendEnd}tickets/reenviomail/${extref}`)

            if (getReenvio.data.status_code !== 200) {
                setErrorAlert("Mail reenviado")
            }
        } catch (err) {
            setErrorAlert(err.toString())
        } finally {
            setLoader(false)
        }
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
                {fechas && fechas.length > 0 && !tickets && !loader && user &&
                    <div className='ContFechas'>
                        {fechas.sort((a, b) => parseFecha(b.fecha) - parseFecha(a.fecha)).map((fech, i) => {

                            const hoy = new Date();
                            const fechaPasada = new Date(hoy);
                            const diasARestar = 40;
                            fechaPasada.setDate(hoy.getDate() - diasARestar);

                            if (parseFecha(fech.fecha) >= fechaPasada) {
                                return (
                                    <div key={i} className='FechaIndCont' onClick={() => buscarTicketsVendidos(fech)}>
                                        <img className='ImgFecha' src={`${fech.imagen_url}`} alt={`${fech.nombre_evento}}`} />
                                        <div className='UbiFecha'>
                                            <IoLocationSharp className='iconCustom' />
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
                            }

                            return null

                        })}
                    </div>
                }

                {tickets && fecha &&
                    <div className='ContEntradasVendidas'>
                        {user && <button dclassName='btn' onClick={() => volverListado()}>Volver a listado de fechas</button>}
                        <h3>Entradas vendidas para el {fecha.nombre_evento}</h3>
                        <div>
                            <h4>Total de entradas vendidas: {tickets.reduce((sum, ticket) => sum + ticket.cantidad, 0)}</h4>
                            <button className="btn btn-primary BotonCentrado" onClick={() => crearExceldeTabla("TablaVentas")}>Descargar en excel</button>
                        </div>
                        <table className="table table-dark" id="TablaVentas">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre y apellido</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Cantidad de entradas</th>
                                    <th scope="col">Importe abonado</th>
                                    <th scope="col">Fecha de compra</th>
                                    <th scope="col">Id. de pago</th>
                                    {user && <th scope="col">Reenviar mail</th>}
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
                                            {user && <td><button disabled={loader} onClick={() => reenviarMail(tic.external_reference)} className="btn">Reenviar</button></td>}
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