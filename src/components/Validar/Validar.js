import { useState, useEffect, useContext} from 'react'
import './Validar.css';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { backendEnd } from "../../utils/urls.js"
import Context from '../../context/SessionContext.js';
import { useNavigate } from 'react-router-dom';

const Validar = () => {

    const [result, setResult] = useState(null);
    const [errorAlert, setErrorAlert] = useState(null)
    const [entradaValida, setEntradaValida] = useState(null)
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate("/login")
      }
    }, [user])

    useEffect(() => {
      const ticketCheck = async () => {
        try {
          const id = result
          const searchTicket = await axios.get(`${backendEnd}tickets/${id}`)

          if (searchTicket.data.status_code !== 200) throw new Error("Error al validar la entrada")

          setEntradaValida(searchTicket.data.data)

        } catch (err) {
          setErrorAlert(err.toString())
        }
      }

      if (result) {
        ticketCheck()
      }
    }, [result])

    const vaciarDatos = () => {
      setEntradaValida(null)
      setResult(null)
      setErrorAlert(null)
    }

    const handleScan = async (data) => {
      vaciarDatos()
      if (data.length) {
        setResult(data[0].rawValue);
      }
    }
  
    const handleError = (error) => {
      setErrorAlert(error);
    }

    return (
        <>
            <h2 className='GestorTitle'>Escanear QR para validar entrada</h2>
            {!result && <Scanner
                onScan={(result) => handleScan(result)}
                onError={(error) => handleError(error?.message)}
            />}
            {result && <button onClick={() => setResult(null)} className='btn btn-primary'>Escanear otra entrada</button>}
            
            {errorAlert && 
            <>
              <h2 className='blanco'>Entrada invalida: {errorAlert}</h2>
              <h3>Resultado de scan: {result}</h3>
            </>}

            {entradaValida && 
            <>
              <h2 className='blanco'>Entrada valida.</h2>
              <div className='EntradaValida'>
                <h2>Nombre del comprador: {entradaValida.nombre}</h2>  
                <h2>Importe abonado: ${entradaValida.importe_total}</h2>  
                <h2>Cantidad de entradas: {entradaValida.cantidad}</h2>  
                <h2>Estado del pago: {entradaValida.estado_pago}</h2>  
              </div>
            </>
            }
        </>
    )   
}

export default Validar;