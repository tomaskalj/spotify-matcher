import "./LoginPage.css";
import {header, loginUrl} from "./spotify";
import {useEffect} from "react";

function LoginPage() {
    useEffect(() => window.localStorage.removeItem("token"));

    return (
        <div className="login">
            {header}

            <a href={loginUrl} id="signInButton">Sign in with Spotify!</a>
        </div>
    );
}

export default LoginPage;