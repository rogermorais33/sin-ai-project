import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";

 function RoutesApp(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/chat" element={<Chat/>}/>
            </Routes>
        </BrowserRouter>
    )
}
export default RoutesApp;