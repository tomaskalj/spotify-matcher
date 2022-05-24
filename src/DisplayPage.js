import "./DisplayPage.css";
import React from "react";
import {getToken, header} from "./spotify";
import ProfileEntryService from "./services/profile_entry.service";
import SpotifyWebApi from "spotify-web-api-js";

class DisplayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spotify: new SpotifyWebApi(),
            loading: false,
            userId: "",
            displayName: "",
            profilePicture: "",
            topArtists: [],
            topGenres: [],
            topTracks: []
        };

        this.handleClick = this.handleClick.bind(this);
    }

    // Runs when DisplayPage first displays, loads all the data from the user's
    // Spotify account including ID, display name, profile picture,
    // top artists, top genres, and top tracks
    componentDidMount() {
        const token = getToken();
        this.state.spotify.setAccessToken(token);

        this.state.spotify.getMe().then(user => {
            this.setState({
                userId: user.id,
                displayName: user.display_name,
                profilePicture: user.images[0].url
            })
        }, error => console.log("Error loading profile data: ", error));

        this.state.spotify.getMyTopArtists({
            limit: 50
        }).then(artistsData => {
            let artists = [];
            artistsData.items.forEach(artist => artists.push(artist.name));
            this.setState({topArtists: artists});

            let genres = [];
            artistsData.items.forEach(artist => artist.genres.forEach(genre => genres.push(genre)));
            this.setState({topGenres: genres});
        }, error => console.log("Error loading top artists: ", error));

        this.state.spotify.getMyTopTracks({
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

    // Runs when the first clicks on the "Find your match" button. Creates an entry
    // in the DB if one does not already exist and redirects the user to MatchPage
    async handleClick(event) {
        event.preventDefault();
        if (!this.state.loading) {
            this.setState({loading: true});

            // If there is no DB entry for them, we need to create one
            if (!await this.entryExists(this.state.userId)) {
                const entry = {
                    user_id: this.state.userId,
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
                console.log("Did not create new entry because one already exists with user ID " + this.state.userId);
            }
            this.setState({loading: false})

            this.props.navigate("/match", {
                // This is kind of a stupid way of passing data to MatchPage but idk
                state: {
                    userId: this.state.userId,
                    displayName: this.state.displayName,
                    profilePicture: this.state.profilePicture,
                    topArtists: this.state.topArtists,
                    topGenres: this.state.topGenres,
                    topTracks: this.state.topTracks
                }
            });
        }
    }

    async entryExists(userId) {
        const response = await ProfileEntryService.getByUserId(userId);
        return response.data.length > 0;
    }

    render() {
        const logout = () => this.props.navigate("/");

        const status = this.state.loading ? "Finding your match" : "Find your match";
        return (
            <div className="display">
                {header}

                <h3>Logged in as {this.state.displayName}</h3>

                <p>
                    <img src={this.state.profilePicture} alt="Profile" className="center"/>
                </p>

                <p>
                    <button onClick={this.handleClick}>{status}</button>
                </p>

                <p>
                    <button onClick={logout}>Logout</button>
                </p>
            </div>
        );
    }
}

export default DisplayPage;