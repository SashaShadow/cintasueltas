import { BrowserRouter } from 'react-router-dom';
import { SessionContext } from "./context/SessionContext.js";
import { ScreenMsgProvider } from "./utils/screenMsg.js";

import './App.css';
import './material-kit.css';

import AppRoutes from './AppRoutes';

function App() {
  return (
    <ScreenMsgProvider>
      <BrowserRouter>
        <SessionContext>
          <AppRoutes />
        </SessionContext>
      </BrowserRouter>
    </ScreenMsgProvider>
  );
}

export default App;
