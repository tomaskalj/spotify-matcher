import "./App.css";
import React, {useState, useEffect, useMemo} from "react";
import {getToken, loginUrl} from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";

function App() {
    const spotify = useMemo(() => {
        return new SpotifyWebApi();
    }, []);

    const [token, setToken] = useState("");

    // Includes the data we want to store about the user who accesses the site
    const initialData = {
        displayName: "",
        profilePicture: "",
    };
    const [profileData, setProfileData] = useState(initialData);
    const [topArtists, setTopArtists] = useState([]);
    const [topGenres, setTopGenres] = useState([]);
    const [topTracks, setTopTracks] = useState([]);

    // https://dev.to/dom_the_dev/how-to-use-the-spotify-api-in-your-react-js-app-50pn
    useEffect(() => {
        const token = getToken();

        spotify.setAccessToken(token);
        setToken(token);
    }, [spotify]);

    // Fetch information about the user, including: display name, profile picture,
    // top artists, top tracks
    useEffect(() => {
        spotify.getMe().then(user => {
            setProfileData({
                displayName: user.display_name,
                profilePicture: user.images[0].url
            });
        }, error => console.log("Error loading profile data: ", error));

        spotify.getMyTopArtists({
            limit: 50
        }).then(artists => {
                setTopArtists(artists.items);

                let genreObj = {};
                artists.items.forEach(artist => artist.genres.forEach(genre => {
                    if (genreObj[genre]) {
                        const freq = genreObj[genre];
                        genreObj[genre] = freq + 1;
                    } else {
                        genreObj[genre] = 1;
                    }
                }));
                let entries = Object.entries(genreObj);
                let sortedTopGenres = entries.sort((a, b) => b[1] - a[1]);

                setTopGenres(sortedTopGenres);
            },
            error => console.log("Error loading top artists: ", error));

        spotify.getMyTopTracks({
            limit: 50
        }).then(tracks => setTopTracks(tracks.items),
            error => console.log("Error loading top tracks: ", error));
    }, [spotify]);

    // Create logout functionality
    const logout = () => {
        spotify.setAccessToken("");
        setToken("");
        window.localStorage.removeItem("token");
    }

    const header = <h1>Spotify Matcher</h1>;

    // If the user isn't logged in prompt them to log in
    if (!token) {
        return (
            <div className="login">
                <header className="login-header">
                    {header}

                    <a href={loginUrl} id="signInButton">Sign in with Spotify!</a>
                </header>
            </div>
        );
    }

    const topArtistsTable = (
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Top Artists</th>
                </tr>
            </thead>

            {topArtists.map((artist, index) => (
                <tbody>
                    <tr key={artist.name}>
                        <td>{index + 1}</td>
                        <td>{artist.name}</td>
                    </tr>
                </tbody>
            ))}
        </table>
    );

    const topTracksTable = (
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Artist</th>
                    <th>Top Tracks</th>
                </tr>
            </thead>

            {topTracks.map((track, index) => (
                <tbody>
                    <tr key={track.name}>
                        <td>{index + 1}</td>
                        <td>{track.artists[0].name}</td>
                        <td>{track.name}</td>
                    </tr>
                </tbody>
            ))}
        </table>
    );

    const topGenresTable = (
        <table>
            <thead>
                <tr>
                    <th>Frequency</th>
                    <th>Top Genres</th>
                </tr>
            </thead>

            {topGenres.map(genre => (
                <tbody>
                    <tr key={genre[0]}>
                        <td>{genre[1]}</td>
                        <td>{genre[0]}</td>
                    </tr>
                </tbody>
            ))}
        </table>
    );

    return (
        <div className="home">
            <header className="home-header">
                {header}

                <h3>Logged in as {profileData.displayName}</h3>

                <p>
                    <img src={profileData.profilePicture} alt="Profile" className="center"/>
                </p>

                {/* Display top artists in a table format */}
                {topArtistsTable}

                {/* Display top tracks by artist in a table format */}
                {topTracksTable}

                {/* Display top genres by frequency in a table format */}
                {topGenresTable}

                <p>
                    <button onClick={logout}>Logout</button>
                </p>
            </header>
        </div>
    );
}

export default App;