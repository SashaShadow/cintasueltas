import { useEffect, useState } from 'react'
import './Videos.css';
import axios from 'axios';
import { backendEnd } from '../../utils/urls.js';
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Videos = () => {

    const [errorAlert, setErrorAlert] = useState(null)
    const [videos, setVideos] = useState(null)
    const [loader, setLoader] = useState(false)
    const [limit, setLimit] = useState(9)

    const navigate = useNavigate();

    useEffect(() => {
        setLoader(true)
        const apiCalls = async () => {
            try {
                const getVideos = await axios.get(`${backendEnd}videos/${limit}`)
                if (getVideos.data.status_code !== 200) throw new Error("Error al traer datos de los videos")
                setVideos(getVideos.data.data.items)
            } catch (err) {
                setErrorAlert(err.toString())
            }
            setLoader(false)

        }
        apiCalls()
    }, [limit])

    return (
        <>
            <div className='ContHome'>
                <h2 className='GestorTitle'>Videos de Cintas Sueltas</h2>
                {loader && <h2 className='Loader'>Cargando...</h2>}
                <div className="LimitCont">
                    <h4>Mostrar últimos:</h4>                     
                        <select className="form-control" onChange={(e) => setLimit(Number(e.target.value))}>
                            <option value="9">9 videos</option>
                            <option value="18">18 videos</option>
                            <option value="27">27 videos</option>
                            <option value="36">36 videos</option>
                        </select>
                </div>
                {errorAlert && 
                <>
                    <h2 className='blanco'>Error: {errorAlert}</h2>
                </>}
                {videos && videos.length > 0 && !loader &&
                <div className='ContVideos'>
                    {videos.map((video, i) => {
                        return (
                            <div key={i} className="ContVideo">
                                <iframe 
                                src={`https://www.youtube.com/embed/${video.id.videoId}`} 
                                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                                </iframe>
                            </div>
                        )
                    })}
                </div>
                }
            </div>
        </>
    )   
}

export default Videos;