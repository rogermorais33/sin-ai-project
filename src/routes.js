import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home"
import Chat from "./pages/Chat";

 function RoutesApp(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/chat" element={<Chat/>}/>
            </Routes>
        </BrowserRouter>
    )
}
export default RoutesApp;