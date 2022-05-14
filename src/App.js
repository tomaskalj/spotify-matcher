import "./App.css";
import React, {useState, useEffect, useMemo} from "react";
import {loginUrl} from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";

function App() {
    const spotify = useMemo(() => {
        return new SpotifyWebApi();
    }, []);

    const [token, setToken] = useState("");

    const initialData = {
        displayName: "",
        profilePicture: ""
    };
    const [userData, setUserData] = useState(initialData);

    // https://dev.to/dom_the_dev/how-to-use-the-spotify-api-in-your-react-js-app-50pn
    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

            window.location.hash = "";
            window.localStorage.setItem("token", token);
        }

        spotify.setAccessToken(token);
        setToken(token);
    }, [spotify]);

    useEffect(() => {
        spotify.getMe().then(user => {
            setUserData({
                displayName: user.display_name,
                profilePicture: user.images[0].url
            });
        });
    }, [spotify]);

    const logout = () => {
        spotify.setAccessToken("");
        setToken("");
        window.localStorage.removeItem("token");
    }

    const temp = (
        <div className="login">
            <header className="login-header">
                <h1>Spotify Matcher</h1>

                <a href={loginUrl} id="signInButton">Sign in with Spotify!</a>
            </header>
        </div>
    );

    if (!token) {
        return (
            <div className="login">
                <header className="login-header">
                    <h1>Spotify Matcher</h1>

                    <a href={loginUrl} id="signInButton">Sign in with Spotify!</a>
                </header>
            </div>
        );
    }

    return (
        <div className="home">
            <header className="home-header">
                <h1>Spotify Matcher</h1>

                <h3>Logged in as {userData.displayName}</h3>

                <img src={userData.profilePicture} alt="Profile" class="center" />

                <button onClick={logout}>Logout</button>
            </header>
        </div>
    );
}

export default App;