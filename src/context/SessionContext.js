import { createContext, useEffect } from "react";
import { useScreenMsgService } from '../utils/screenMsg.js'
import axios from "axios";
import useLocalStorage from "../services/LocalStorState/LocalStorState.js";
import { backendEnd } from "../utils/urls.js"
import { useNavigate } from "react-router-dom";

const Context = createContext();

export const SessionContext = ({ children }) => {

  const [token, setToken] = useLocalStorage(null, "token");
  const [user, setUser] = useLocalStorage(null, "user");
  const { setScreenMsg } = useScreenMsgService()
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setToken(null);
          setUser(null);
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [setToken, setUser, navigate]);

  const getAxiosInstance = (baseUrl) => {
    return axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  };

  const validateToken = async () => {
    try {
      const response = await axios.post(`${backendEnd}admin/vldt-tkn`, { token });
      return response.data.isValid;
    } catch (error) {
      return false;
    }
  }


  return <Context.Provider value={{ setToken, token, user, setUser, getAxiosInstance, setScreenMsg, validateToken }} >
    {children}
  </Context.Provider>
}

export default Context;