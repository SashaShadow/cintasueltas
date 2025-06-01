import './Start.css';
import MatrixRain from '../Matrix/Matrix.js'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Start = () => {

    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
        document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className='ContStart'>
            <MatrixRain />
            <div className='ContLogo'>
                <img src="/LOGO.PNG" className='LogoCS' alt="logo" />
                <h3 className='blinktext parpadea testLetra' onClick={() => navigate("/home")}>Press Start</h3>
            </div>
        </div>
    )   
}

export default Start;