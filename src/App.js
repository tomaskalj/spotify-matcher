import "./App.css";
import React from "react";
import LoginPage from "./LoginPage";
import DisplayPage from "./DisplayPage";
import MatchPage from "./MatchPage";
import {Route, Routes, useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();

    return (
        <div>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/home" element={<DisplayPage navigate={navigate}/>}/>
                <Route path="/match" element={<MatchPage/>}/>
            </Routes>
        </div>
    );
}

export default App;