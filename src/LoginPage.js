import "./LoginPage.css";
import {header, loginUrl} from "./spotify";
import hearts from './hearts-pink-hearts.gif'
import rose from './rose1.gif'
import {useEffect} from "react";

function LoginPage() {
    useEffect(() => window.localStorage.removeItem("token"));

    document.body.style = 'background-image: linear-gradient(pink, white);';
    return (
        <div className="login">
            <div style={{
                position: "absolute",
                marginLeft: 'auto',
                marginRight: 'auto',
                left: 0,
                right: 0,
                textAlign: 'center',
                top: 0
            }}>
            {header}

            <a href={loginUrl} id="signInButton">oo Sign in with Spotify! Your future awaits oo</a>
            <h1>-xoxo matchmakers of dev</h1>
            </div>
            <img src={hearts} alt="loading..."
            style={{
                position: 'absolute',
                height: '100%',
                width: '25%',
                top: '0',
                right: '0',
                zIndex: 2
            }}
            />
            <img src={rose} alt="rose" style={{
                position: 'absolute',
                height: '250px',
                left: 520,
                top: 250
            }}/>
            <img src={hearts} alt="loading..."
            style={{
                position: 'absolute',
                height: '100%',
                top: '0',
                left: "0",
                width: '25%',
                zIndex: 2
            }}
            />
        </div>
    );
}

export default LoginPage;