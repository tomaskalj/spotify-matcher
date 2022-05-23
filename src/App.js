import "./App.css";
import React from "react";
import {getToken} from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import LoginPage from "./LoginPage";
import DisplayPage from "./DisplayPage";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            token: "",
            spotify: new SpotifyWebApi()
        };
    }

    componentDidMount() {
        const token = getToken();
        this.setState({token: token});
        this.state.spotify.setAccessToken(token);
    }

    render() {
        const logout = () => {
            this.state.spotify.setAccessToken("");
            this.setState({token: ""});
            window.localStorage.removeItem("token");
        }

        if (!this.state.token) {
            return <LoginPage/>;
        }

        return <DisplayPage
            spotify={this.state.spotify}   // Need to pass spotify web API through props to retrieve user info
            logout={logout}                // Need to pass logout functionality through props
        />
    }
}

export default App;