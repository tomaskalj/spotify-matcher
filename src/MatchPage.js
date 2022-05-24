import React from "react";
import {header} from "./spotify";
import {useLocation} from "react-router-dom";
import ProfileEntryService from "./services/profile_entry.service";

function MatchPage(props) {
    const location = useLocation();
    const logout = () => props.navigate("/");

    return <MatchPageWrapper {...props} location={location} logout={logout}/>
}

class MatchPageWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileEntries: []
        };
    }

    componentDidMount() {
        this.retrieveEntries();
    }

    retrieveEntries() {
        ProfileEntryService.getAll().then(response => {
            console.log(response.data);
            this.setState({profileEntries: response.data});
        })
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

    determineMatch() {
        /**
         * this.state.profileEntries refers to every profile entry in the database
         * (remember not to compare against self :inflate:)
         */

        // Your top artists
        const topArtists = this.props.location.state.topArtists;
        // Your top genres
        const topGenres = this.props.location.state.topGenres;
        // Your top genres by frequency as a list of lists, i.e.
        // [["pop", 15], ["cloud", 9], ["rap", 5], ...]
        const topGenresFreqMap = this.getFrequencyMap(topGenres);
        // Your top tracks
        const topTracks = this.props.location.state.topTracks;

        // Similarly, you can get your userId, displayName, profilePicture by doing
        // this.props.location.state.{field}
    }

    render() {
        return (
            <div className="match-page">
                {header}

                {/* just renders their username */}
                <p>{this.props.location.state.displayName}</p>

                {/* Render match here */}

                <p>
                    <button onClick={this.props.logout}>Logout</button>
                </p>
            </div>
        )
    }
}

export default MatchPage;