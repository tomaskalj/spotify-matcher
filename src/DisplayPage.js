import "./DisplayPage.css";
import React from "react";
import {header} from "./spotify";
import ProfileEntryService from "./services/profile_entry.service";

class DisplayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            id: "",
            displayName: "",
            profilePicture: "",
            topArtists: [],
            topGenres: [],
            topTracks: []
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.props.spotify.getMe().then(user => {
            this.setState({
                id: user.id,
                displayName: user.display_name,
                profilePicture: user.images[0].url
            })
        }, error => console.log("Error loading profile data: ", error));

        this.props.spotify.getMyTopArtists({
            limit: 50
        }).then(artistsData => {
            let artists = [];
            artistsData.items.forEach(artist => artists.push(artist.name));
            this.setState({topArtists: artists});

            let genres = [];
            artistsData.items.forEach(artist => artist.genres.forEach(genre => genres.push(genre)));
            this.setState({topGenres: genres});
        }, error => console.log("Error loading top artists: ", error));

        this.props.spotify.getMyTopTracks({
            limit: 50
        }).then(tracksData => {
            let tracks = [];
            tracksData.items.forEach(item => {
                let trackName = item.artists.map(a => a.name).join(", ");
                trackName += " - " + item.name;
                tracks.push(trackName);
            });

            this.setState({topTracks: tracks});
        }, error => console.log("Error loading top tracks: ", error));
    }

    async handleClick(event) {
        event.preventDefault();
        if (!this.state.loading) {
            this.setState({loading: true});
            // If there is no DB entry for them, we need to create one
            if (!await this.entryExists(this.props.spotify.getAccessToken())) {
                const entry = {
                    id: this.state.id,
                    display_name: this.state.displayName,
                    image_url: this.state.profilePicture,
                    top_artists: this.state.topArtists,
                    top_genres: this.state.topGenres,
                    top_tracks: this.state.topTracks
                };

                console.log(entry);

                ProfileEntryService.create(entry)
                    .then(response => console.log(response.data))
                    .catch(e => console.log(e));
            } else {
                console.log("Did not create new entry because one already exists");
            }
            this.setState({loading: false})
        }
    }

    async entryExists(token) {
        const response = await ProfileEntryService.getByToken(token);
        return response.data.length > 0;
    }

    getFrequencyMap(genres) {
        let genreObj = {};
        genres.forEach(genre => {
            if (genreObj[genre]) {
                const freq = genreObj[genre];
                genreObj[genre] = freq + 1;
            } else {
                genreObj[genre] = 1;
            }
        });
        let entries = Object.entries(genreObj);
        return entries.sort((a, b) => b[1] - a[1]);
    }

    topArtistsTable() {
        return (
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
    }

    topTracksTable() {
        return (
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
    }

    topGenresTable() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Frequency</th>
                        <th>Top Genres</th>
                    </tr>
                </thead>

                {this.getFrequencyMap(this.state.topGenres).map(genre => (
                    <tbody>
                        <tr key={genre[0]}>
                            <td>{genre[1]}</td>
                            <td>{genre[0]}</td>
                        </tr>
                    </tbody>
                ))}
            </table>
        );
    }

    render() {
        const status = this.state.loading ? "Finding your match" : "Find your match";
        return (
            <div className="display">
                {header}

                <h3>Logged in as {this.state.displayName}</h3>

                <p>
                    <img src={this.state.profilePicture} alt="Profile" className="center"/>
                </p>

                {/* Display top artists in a table format */}
                {/*{this.topArtistsTable()}*/}

                {/* Display top tracks by artist in a table format */}
                {/*{this.topTracksTable()}*/}

                {/* Display top genres by frequency in a table format */}
                {/*{this.topGenresTable()}*/}

                <p>
                    <button onClick={this.handleClick}>{status}</button>
                </p>

                <p>
                    <button onClick={this.props.logout}>Logout</button>
                </p>
            </div>
        );
    }
}

export default DisplayPage;