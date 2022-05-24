import "./App.css";
import React from "react";
import LoginPage from "./LoginPage";
import DisplayPage from "./DisplayPage";
import MatchPage from "./MatchPage";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";

function App() {
    // const navigate = useNavigate();
    // const routeChange = (path) => {
    //     navigate(path);
    // }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/home" element={<DisplayPage/>}/>
                <Route path="/match" element={<MatchPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;