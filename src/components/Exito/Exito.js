import { useEffect, useState, useRef } from 'react'
import './Exito.css';
import axios from 'axios';
import { backendEnd } from '../../utils/urls.js';
import { useLocation  } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Exito = () => {
    const location = useLocation();
    const { pathname } = location;

    const [queryParams, setQueryParams] = useState(Object.fromEntries(new URLSearchParams(location.search)))
    const [ticket, setTicket] = useState(null)
    const [errorAlert, setErrorAlert] = useState(null)
    const [loader, setLoader] = useState(false)
    const divRef = useRef(null);

    useEffect(() => {
        const esExitoUrl = pathname.includes('success') 
        if (esExitoUrl) {
            if (queryParams) {
                const apiCalls = async () => {
                    try {
                        setLoader(true)
                        const payload = {estado_pago: queryParams.status, id_pago: queryParams.payment_id}
                        const ticketUpd = await axios.put(`${backendEnd}tickets/pagoext/${queryParams.external_reference}`, payload)
                        if (ticketUpd.data.status_code !== 200) throw new Error("Error al actualizar el pago y obtener los tickets")
                        
                        setTicket(ticketUpd.data.data)
                    } catch (err) {
                        setErrorAlert(err.toString())
                    }
                    setLoader(false)

                }
                apiCalls()
            }
        } 
    }, [])

    const descargarPDF = async () => {
        const canvas = await html2canvas(divRef.current);
        const imgData = canvas.toDataURL('image/png');
    
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
    
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    
        pdf.save(`TicketCintasSueltasFest${ticket.ticket._id}.pdf`);
    };


    return (
        <>
            <h2 className='GestorTitle'>Compra realizada con éxito.</h2>
            <div className='ContHome'>
                {loader && <h2 className='Loader'>Cargando...</h2>}

                {errorAlert && 
                <>
                <h2 className='blanco'>Error: {errorAlert}</h2>
                </>}

                {ticket && 
                <>
                    <h3 className='blanco'>Tus tickets para el {ticket.fecha.nombre_evento}.</h3>
                    <p>Tambien te mandamos esta información al email.</p>
                    <div className='EntradaValida' ref={divRef}>
                        <img src="/LOGO.PNG" className='LogoEntrada' alt="logo"/>   
                        <img className='Qr' src={`data:image/png;base64,${ticket.qr_code}`} alt="QR Code"/>
                        <h4>Cantidad de entradas: {ticket.ticket.cantidad}</h4>  
                        <h4>Importe abonado: ${ticket.ticket.importe_total}</h4>  
                    </div>
                    <button className='btn btn-primary BotonCentrado' onClick={() => descargarPDF()}>Descargar entrada en PDF</button>
                </>
                }
            </div>

        </>
    )   
}

export default Exito;