import "./DisplayPage.css";
import React from "react";
import {header} from "./spotify";

class DisplayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: "",
            profilePicture: "",
            topArtists: [],
            topGenres: [],
            topTracks: []
        };
    }

    componentDidMount() {
        this.props.spotify.getMe().then(user => {
            this.setState({
                displayName: user.display_name,
                profilePicture: user.images[0].url
            })
        }, error => console.log("Error loading profile data: ", error));

        this.props.spotify.getMyTopArtists({
            limit: 50
        }).then(artists => {
                this.setState({topArtists: artists.items});

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

                this.setState({topGenres: sortedTopGenres});
            },
            error => console.log("Error loading top artists: ", error));

        this.props.spotify.getMyTopTracks({
            limit: 50
        }).then(tracks => this.setState({topTracks: tracks.items}),
            error => console.log("Error loading top tracks: ", error));
    }

    render() {
        const topArtistsTable = (
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Top Artists</th>
                    </tr>
                </thead>

                {this.state.topArtists.map((artist, index) => (
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

                {this.state.topTracks.map((track, index) => (
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

                {this.state.topGenres.map(genre => (
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
            <div className="display">
                {header}

                <h3>Logged in as {this.state.displayName}</h3>

                <p>
                    <img src={this.state.profilePicture} alt="Profile" className="center"/>
                </p>

                {/* Display top artists in a table format */}
                {topArtistsTable}

                {/* Display top tracks by artist in a table format */}
                {topTracksTable}

                {/* Display top genres by frequency in a table format */}
                {topGenresTable}

                <p>
                    <button onClick={this.props.logout}>Logout</button>
                </p>
            </div>
        );
    }
}

export default DisplayPage;