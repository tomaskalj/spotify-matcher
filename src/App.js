import "./App.css";
import React, {useState, useEffect, useMemo} from "react";
import {getToken} from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import LoginPage from "./LoginPage";
import DisplayPage from "./DisplayPage";
import TestPage from "./TestPage";

function App() {
    const spotify = useMemo(() => {
        return new SpotifyWebApi();
    }, []);

    const [token, setToken] = useState("");

    // https://dev.to/dom_the_dev/how-to-use-the-spotify-api-in-your-react-js-app-50pn
    useEffect(() => {
        const token = getToken();

        spotify.setAccessToken(token);
        setToken(token);
    }, [spotify]);

    // Create logout functionality
    const logout = () => {
        spotify.setAccessToken("");
        setToken("");
        window.localStorage.removeItem("token");
    }

    // If the user isn't logged in prompt them to log in
    if (!token) {
        return <LoginPage/>;
    }

    return <TestPage logout={logout}/>
    // return <DisplayPage spotify={spotify} logout={logout}/>
}

export default App;