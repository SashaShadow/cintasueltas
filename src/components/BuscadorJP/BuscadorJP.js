import { useState, useEffect } from 'react'
import { backendEnd } from "../../utils/urls.js"
import axios from 'axios';
import './BuscadorJP.css';

const BuscadorJP = () => {

    const [errorAlert, setErrorAlert] = useState(null)
    const [loader, setLoader] = useState(false)
    const [registros, setRegistros] = useState(null)
    const [registrosCopy, setRegistrosCopy] = useState(null)
    const [filtros, setFiltros] = useState({nivel: 100, palabra: null, kanji: null, romaji: null, furigana: null})

    useEffect(() => {
        const apiCalls = async () => {
            setLoader(true)

            try {
                const palabrasCall = await axios.get("https://jlpt-vocab-api.vercel.app/api/words/all")

                setRegistros(palabrasCall.data)
            } catch (err) {
                setErrorAlert(err.toString())
            } finally {
                setLoader(false)
            }
        }
            apiCalls()
    }, [])

    useEffect(() => {
        if (registros && registros.length) {
            let regClone = structuredClone(registros)
            console.log(regClone)

            if (filtros.nivel !== 100) {
                regClone = regClone.filter(reg => reg.level === filtros.nivel)
            }

            if (filtros.palabra) {
                regClone = regClone.filter(reg => reg.meaning.includes(filtros.palabra))
            }

            if (filtros.kanji) {
                regClone = regClone.filter(reg => reg.word.includes(filtros.kanji))
            }

            if (filtros.romaji) {
                regClone = regClone.filter(reg => reg.romaji.includes(filtros.romaji))
            }

            if (filtros.furigana) {
                regClone = regClone.filter(reg => reg.furigana.includes(filtros.furigana))
            }
            console.log(regClone)
            if (!filtros.palabra && !filtros.kanji && !filtros.romaji && !filtros.furigana) {
                setRegistrosCopy(null)
            } else {
                setRegistrosCopy(regClone)
            }
        }
    }, [filtros, registros])
    
    return (
        <>
            <h1 className=''>Diccionario japonés</h1>
            {errorAlert && 
            <>
              <h2 className='blanco'>{errorAlert}</h2>
            </>}

            {loader && 
            <>
                <h3 className='Loading'>Cargando...</h3>
                <span className="loader"></span>
            </>
            }
            
                {registros && registros.length >= 1 &&
                <div className='ContJP'>
                    <div className="EleccionesJP">
                        <button onClick={() => setFiltros({...filtros, nivel: 100})} className="btn btn-primary">Todos los niveles</button>
                        <button onClick={() => setFiltros({...filtros, nivel: 5})} className="btn btn-primary">N5</button>
                        <button onClick={() => setFiltros({...filtros, nivel: 4})} className="btn btn-primary">N4</button>
                        <button onClick={() => setFiltros({...filtros, nivel: 3})} className="btn btn-primary">N3</button>
                        <button onClick={() => setFiltros({...filtros, nivel: 2})} className="btn btn-primary">N2</button>
                        <button onClick={() => setFiltros({...filtros, nivel: 1})} className="btn btn-primary">N1</button>
                    </div>

                    <div className="BuscadoresJP">
                        <input onChange={(e) => setFiltros({...filtros, palabra: e.target.value.toLowerCase()})} className="form-control" placeholder="Buscar por palabra (ingles)"/>
                        <input onChange={(e) => setFiltros({...filtros, kanji: e.target.value.toLowerCase()})} className="form-control" placeholder="Buscar por kanji"/>
                        <input onChange={(e) => setFiltros({...filtros, romaji: e.target.value.toLowerCase()})} className="form-control" placeholder="Buscar por romaji"/>
                        <input onChange={(e) => setFiltros({...filtros, furigana: e.target.value.toLowerCase()})} className="form-control" placeholder="Buscar por furigana"/>
                    </div>
                </div>
                }

            <div className="TablaJP">
                {registrosCopy ? 
                <>
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Kanji</th>
                                <th scope="col">Significado</th>
                                <th scope="col">Romaji</th>
                                <th scope="col">Furigana</th>
                                <th scope="col">Nivel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrosCopy.map((pal, i) => {
                                return (
                                    <tr key={i}>
                                        <th scope="row">{pal.word}</th>
                                        <td>{pal.meaning}</td>
                                        <td>{pal.romaji}</td>
                                        <td>{pal.furigana}</td>
                                        <td>N{pal.level}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        </table>
                </> : <p>Iniciar busqueda para ver resultados</p>
                }
            </div>
        </>    
    )   
}

export default BuscadorJP;