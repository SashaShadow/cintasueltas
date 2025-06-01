import { useState, useContext } from 'react'
import { backendEnd } from "../../utils/urls.js"
import Context from '../../context/SessionContext.js'; 
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const { setUser, setToken } = useContext(Context)
    const [errorAlert, setErrorAlert] = useState(null)
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoader(true)
        try {
            const username = e.target.elements.username.value;
            const password = e.target.elements.password.value;

            const credenciales = {
                username, password
            }

            const loginAccion = await axios.post(`${backendEnd}admin/login/`, credenciales)

            if (loginAccion.data.error) throw new Error(loginAccion.data.error)

            setToken(loginAccion.data.access_token)
            setUser({username: username})

            navigate('/home');

        } catch (err) {
            setErrorAlert(err.toString())
        }
        setLoader(false)
    }

    return (
        <>
            <h1 className='GestorTitle'>Login</h1>
            {errorAlert && 
            <>
              <h2 className='blanco'>{errorAlert}</h2>
            </>}

            {loader && 
            <>
                <h3 className='Loading'>Cargando...</h3>
                <span class="loader"></span>
            </>
            }
            <div className='ContLogin'>
                <div className="back">
                    <div className="div-center">
                        <div className="content">
                            <form onSubmit={onSubmit}>
                            <div className="form-group divin">
                                <label htmlFor="username">Usuario</label>
                                <input type="text" className="form-control" name='username' id="username" placeholder="usuario"/>
                            </div>
                            <div className="form-group divin">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" name='password' id="password" placeholder="password"/>
                            </div>
                            <button type="submit" className="btn btn-primary">Login</button>
                            <hr/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>    
    )   
}

export default Login;