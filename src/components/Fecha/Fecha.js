import { useContext, useEffect, useState } from 'react'
import './Fecha.css';
import axios from 'axios';
import { backendEnd } from '../../utils/urls.js';
import { useLocation  } from 'react-router-dom';
import Context from '../../context/SessionContext.js';
import { MdEdit } from "react-icons/md";
import CrearFecha from '../CrearFecha/CrearFecha.js';
import { FaCalendarAlt } from "react-icons/fa";

const Fecha = () => {
    const location = useLocation();
    const { pathname } = location;

    const [fecha, setFecha] = useState(null)
    const [errorAlert, setErrorAlert] = useState(null)
    const [loader, setLoader] = useState(false)
    const [valorInfo, setValorInfo] = useState(0)
    const [cantidad, setCantidad] = useState(0)
    const [comprar, setComprar] = useState(false)
    const [sePuedecomprar, setSePuedeComprar] = useState(false)
    const [datosCompra, setDatosCompra] = useState({
            "nombre": null,
            "email": null,
            })
    const [idFecha, setIdFecha] = useState(pathname.split('/')[pathname.split('/').length - 1])
    const { user, token } = useContext(Context);
    const [fechaEditar, setFechaEditar] = useState(null)

    useEffect(() => {
        const esFechaUrl = pathname.includes('fecha') 
        if (esFechaUrl) {
            let urlDividido = pathname.split('/')

            if (urlDividido.length === 3) {
                const apiCalls = async () => {
                    try {
                        setLoader(true)
                        const getFecha = await axios.get(`${backendEnd}fechas/${urlDividido[urlDividido.length - 1]}/`)
                        if (getFecha.data.status_code !== 200) throw new Error("Error al traer datos de las fechas")
                        
                        setFecha(getFecha.data.data)
                    } catch (err) {
                        setErrorAlert(err.toString())
                    }
                    setLoader(false)

                }
                apiCalls()
            }
        } 
    }, [])

    useEffect(() => {
        const dcKeys = Object.keys(datosCompra)
        const todosLlenos = dcKeys.every(key => datosCompra[key])
        setSePuedeComprar(todosLlenos)
    }, [datosCompra])

    const cantiChange = canti => {
        setCantidad(`${canti}`)
        const valorNuevo = canti * fecha.valor
        setValorInfo(valorNuevo)
        if (!canti) {
           setComprar(false)
           setCantidad(null)
        }
    }

    const handleChange = (e) => {
        setDatosCompra({ ...datosCompra, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)

        let datosCompraCopy = structuredClone(datosCompra)
        datosCompraCopy.fecha =  new Date().toLocaleDateString()
        datosCompraCopy.id_fecha = idFecha
        datosCompraCopy.cantidad = Number(cantidad)

        try {
            const crearTicket = await axios.post(`${backendEnd}tickets`, datosCompraCopy)
            if (crearTicket.data.status_code !== 200) throw new Error("Error al crear la fecha")
            
            const newA = document.createElement("a")
            newA.href = crearTicket.data.data
            newA.click()
        } catch (err) {
            setErrorAlert(err.toString())
            setLoader(false)
        }
    };

    return (
        <>
            <div className='ContHome'>
                {loader && <h2 className='Loader'>Cargando...</h2>}
                {errorAlert && 
                <>
                <h2 className='blanco'>Error: {errorAlert}</h2>
                </>}
                {fecha && !fechaEditar &&
                <div className='ContFechaDetalle'>
                    <div className='InfoFecha'>
                        <h3 className=''>{fecha.nombre_evento}</h3>
                        <table className="table table-dark equal-cols">
                            <thead>
                                <tr>
                                    <th scope="col">Tipo de ticket</th>
                                    <th scope="col">Valor</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Total</th>
                                    <th scope="col"></th>
                                    {user && <th scope="col">Editar fecha</th>}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th data-label="Entrada">Entrada general</th>
                                    <td data-label="Valor">{fecha.valor}</td>
                                    <td data-label="Cantidad">
                                        <select className='form-control' disabled={!fecha.activa} defaultValue={0} onChange={(e) => cantiChange(Number(e.target.value))}>
                                        {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </td>
                                    <td data-label="Total">${valorInfo}</td>
                                    <td data-label="">
                                        {fecha.activa ? <button className='btn' onClick={() => setComprar(true)} disabled={!cantidad}>Siguiente</button>
                                        : <p>Compra deshabilitada</p>}
                                    </td>
                                    {user && <td data-label="Editar fecha"><MdEdit onClick={() => setFechaEditar(fecha)} className='EditarFechaIc' /></td>}
                                </tr>
                            </tbody>
                        </table>
                        {comprar && fecha.activa &&
                        <>
                            <p>Datos requeridos pues te enviaremos tus tickets al email.</p>
                            <form className="container-fluid mt-4" onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                    <label className="form-label">Nombre y apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        onChange={handleChange}
                                    />
                                    </div>
                                    <div className="col-md-4">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        onChange={handleChange}
                                    />
                                    </div>
                                </div>
                                <button disabled={!sePuedecomprar || loader || !fecha.activa} type="submit" className="btn">Finalizar compra</button>
                            </form>
                        </>    
                        }
                        <div className='DetallesFechaDesc'>
                            <p>{fecha.descripcion}</p>
                            <div>
                                <p>Dirección: {fecha.direccion}</p>
                                <p>Se toca en: {fecha.nombre_lugar}</p>
                                <p><FaCalendarAlt/> Dia y horario: {fecha.fecha} a partir de las {fecha.hora}HS</p>
                            </div>
                        </div>
                        
                    </div>
                    <div className='imgfecha'>
                        <img className='ImagenDetalle' src={fecha.imagen_url} />
                    </div>
                </div>
                }
                {fechaEditar && <CrearFecha fechaEditar={fechaEditar} setFechaEditar={setFechaEditar}/>}
            </div>

        </>
    )   
}

export default Fecha;