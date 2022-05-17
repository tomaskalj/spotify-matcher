import "./LoginPage.css";
import {header, loginUrl} from "./spotify";

function LoginPage() {
    return (
        <div className="login">
            {header}

            <a href={loginUrl} id="signInButton">Sign in with Spotify!</a>
        </div>
    );
}

export default LoginPage;