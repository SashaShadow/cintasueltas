import { useState, createContext } from "react";
import { useScreenMsgService } from '../utils/screenMsg.js'
import axios from "axios";
import useLocalStorage from "../services/LocalStorState/LocalStorState.js";

const Context = createContext();

export const SessionContext = ({children}) => {

    const [token, setToken] = useState(null);
    const [checkToken, setCheckToken] = useState(false);
    const [user, setUser] = useLocalStorage(null, "user");;
    const { setScreenMsg } = useScreenMsgService()

    const getAxiosInstance = (baseUrl) => {
        return axios.create({
          baseURL: baseUrl,
          headers:  {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
    };

    return <Context.Provider value={{setToken, token, setCheckToken, checkToken, user, setUser, getAxiosInstance}} >
            {children}
    </Context.Provider>
}

export default Context;