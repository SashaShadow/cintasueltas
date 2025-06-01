import React, { useState, useContext } from "react";

export const ScreenMsg = ({status = false, mode = "", msg = "", show = false, setShow}) => {

    const closeMsg = () => {
        setShow(false)
    }

    if (status && show) {
        return (
            <div className={`alert ${mode === "succ" ? "success" : "error"} msgBanner`}>
                <div className='container2'>
                    <div className='Message'><i className="material-icons Cicon">check</i> {msg}</div>
                    <button onClick={() => closeMsg()} type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true"><i className="material-icons">clear</i></span>
                    </button>
                </div>
            </div>
        )
    }
}

const ScreenMsgContext = React.createContext();

export const ScreenMsgProvider = ({children}) => {

    const [status, setStatus] = useState(false);
    const [msg, setMsg] = useState("");
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState("");

    const setScreenMsg = (status, mode, msg, show) => {
        setMsg(msg)
        setStatus(status)
        setShow(show)
        setMode(mode)
    }

    return (
        <ScreenMsgContext.Provider value={{setScreenMsg, status, msg, show, setShow, mode}}>
            {children}
        </ScreenMsgContext.Provider>
    )
}

export const useScreenMsgService = () => {
    return useContext(ScreenMsgContext)
}