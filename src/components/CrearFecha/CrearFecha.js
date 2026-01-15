import { useState, useEffect, useContext} from 'react'
import './CrearFecha.css';
import axios from 'axios';
import { backendEnd } from "../../utils/urls.js"
import Context from '../../context/SessionContext.js';
import { useNavigate } from 'react-router-dom';

const CrearFecha = ({fechaEditar, setFechaEditar}) => {

    const dateFormat = fecha => {
        if (fecha.includes('/')) {
            let [dia, mes, anio] = fecha.split('/')
            if (dia.length === 1) {
                dia = `0${dia}`
            }
            if (mes.length === 1) {
                mes = `0${mes}`
            }
            const fechaFormateada = `${anio}-${mes}-${dia}`
            return fechaFormateada
        } else if (fecha.includes('-')) {
            const [anio, mes, dia] = fecha.split('-')
            const fechaFormateada = `${dia}/${mes}/${anio}`
            return fechaFormateada
        }
    }

    const [fecha, setFecha] = useState({
        "valor": fechaEditar ? fechaEditar.valor : null,
        "nombre_evento": fechaEditar ? fechaEditar.nombre_evento : null,
        "direccion": fechaEditar ? fechaEditar.direccion : null,
        "nombre_lugar": fechaEditar ? fechaEditar.nombre_lugar : null,
        "imagen_url": fechaEditar ? fechaEditar.imagen_url : null,
        "activa": fechaEditar ? fechaEditar.activa : true,
        "descripcion": fechaEditar ? fechaEditar.descripcion : null,
        "fecha": fechaEditar ? dateFormat(fechaEditar.fecha) : null,
        "hora": fechaEditar ? fechaEditar.hora : null,
        "doble": fechaEditar ? fechaEditar.doble : false,
        "gorra": fechaEditar ? fechaEditar.gorra : false}); 

    const [errorAlert, setErrorAlert] = useState(null)
    const [sePuedeCrear, setSePuedeCrear] = useState(null)
    const { user, token } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const fechaKeys = Object.keys(fecha)

        const todosLlenos = fechaKeys.every(key => {
            if (key !== "activa" && key !== "gorra" && key !== "doble") {
                return fecha[key]
            } else {
                return true
            }
        })

        setSePuedeCrear(todosLlenos)
    }, [fecha])


    useEffect(() => {
      if (!user) {
        navigate("/login")
      }
    }, [user])

    const handleChange = (e) => {
        if (e.target.name === "activa") {
            setFecha({ ...fecha, [e.target.name]: e.target.value === "true"});
        } else if (e.target.name === "gorra") {
            setFecha({ ...fecha, [e.target.name]: e.target.value === "true"});
        } else if (e.target.name === "doble") {
            setFecha({ ...fecha, [e.target.name]: e.target.value === "true"});
        } else {
            setFecha({ ...fecha, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let [anio, mes, dia] = fecha.fecha.split("-")
        let fmtDate = `${dia}/${mes}/${anio}`

        let fechaCopy = structuredClone(fecha)
        fechaCopy.fecha = fmtDate

        try {
            let headers = {
                Authorization: `Bearer ${token}`
            }

            if (fechaEditar) {
                const editarfecha = await axios.put(`${backendEnd}fechas/${fechaEditar._id}`, fechaCopy, {headers: headers})
                if (editarfecha.data.status_code !== 200) throw new Error("Error al editar la fecha")
            } else {
                const crearfecha = await axios.post(`${backendEnd}fechas/`, fechaCopy, {headers: headers})
                if (crearfecha.data.status_code !== 200) throw new Error("Error al crear la fecha")
            }
            
            navigate("/home")
        } catch (err) {
            setErrorAlert(err.toString())
        }
    };

    return (
        <>
            <h2 className='blanco'>{fechaEditar ? "Editar" : "Crear nueva"} fecha</h2>
            
            {errorAlert && 
            <>
              <h2 className='blanco'>Error: {errorAlert}</h2>
            </>}

            <div className='ContHome'>
                {fechaEditar && <button onClick={() => setFechaEditar(null)} className='btn'>Volver a listado de fechas</button>}
                <div className='FormFecha'>
                <form className="container-fluid mt-4" onSubmit={handleSubmit}>

                {/* Primera fila */}
                <div className="row mb-3">
                    <div className="col-md-4">
                    <label className="form-label">Valor de entrada</label>
                    <input
                        type="text"
                        className="form-control"
                        name="valor"
                        defaultValue={fecha.valor}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="col-md-4">
                    <label className="form-label">Nombre del evento</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre_evento"
                        defaultValue={fecha.nombre_evento}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="col-md-4">
                    <label className="form-label">Dirección</label>
                    <input
                        type="text"
                        className="form-control"
                        name="direccion"
                        defaultValue={fecha.direccion}
                        onChange={handleChange}
                    />
                    </div>
                </div>

                {/* Segunda fila */}
                <div className="row mb-3">
                    <div className="col-md-4">
                    <label className="form-label">Nombre del lugar</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre_lugar"
                        defaultValue={fecha.nombre_lugar}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="col-md-4">
                    <label className="form-label">Imagen URL</label>
                    <input
                        type="text"
                        className="form-control "
                        name="imagen_url"
                        defaultValue={fecha.imagen_url}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="col-md-4">
                    <label className="form-label">Descripción</label>
                    <input
                        type="textarea"
                        className="form-control"
                        name="descripcion"
                        defaultValue={fecha.descripcion}
                        onChange={handleChange}
                    />
                    </div>
                </div>

                {/* Tercera fila */}
                <div className="row mb-3">
                    <div className={fechaEditar ? "col-md-3" : "col-md-6"}>
                    <label className="form-label">Fecha</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fecha"
                        defaultValue={fecha.fecha}
                        onChange={handleChange}
                    />
                    </div>
                    <div className={fechaEditar ? "col-md-3" : "col-md-6"}>
                    <label className="form-label">Hora</label>
                    <input
                        type="time"
                        className="form-control"
                        name="hora"
                        defaultValue={fecha.hora}
                        onChange={handleChange}
                    />
                    </div>
                    {fechaEditar &&
                    <div className="col-md-3">
                        <label className="form-label">Fecha activa</label>
                        <select className='form-control' onChange={handleChange} name="activa" value={fecha.activa}>
                            <option value={true}>Si</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                    }

                    {/* {fechaEditar &&
                    <div className="col-md-3">
                        <label className="form-label">Fecha a la gorra</label>
                        <select className='form-control' onChange={handleChange} name="gorra" value={fecha.gorra}>
                            <option value={true}>Si</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                    } */}

                    {fechaEditar &&
                    <div className="col-md-3">
                        <label className="form-label">2X1 habilitado</label>
                        <select className='form-control' onChange={handleChange} name="doble" value={fecha.doble}>
                            <option value={true}>Si</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                    }
                </div>

                <button type="submit" disabled={!sePuedeCrear} className="btn btn-primary">{fechaEditar ? "Editar" : "Crear"} fecha</button>
                </form>
                    
                </div>
            </div>

            
        </>
    )   
}

export default CrearFecha;