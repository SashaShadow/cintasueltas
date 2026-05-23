import { createContext } from "react";
import { useScreenMsgService } from '../utils/screenMsg.js'
import axios from "axios";
import useLocalStorage from "../services/LocalStorState/LocalStorState.js";
import { backendEnd } from "../utils/urls.js"

const Context = createContext();

export const SessionContext = ({ children }) => {

  const [token, setToken] = useLocalStorage(null, "token");
  const [user, setUser] = useLocalStorage(null, "user");;
  const { setScreenMsg } = useScreenMsgService()

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