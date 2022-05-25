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

        const userId = this.props.location.state.userId;
        const displayName = this.state.displayName;

        let user_score_matches = [];

        for (let i = 0; i < this.state.profileEntries.length; i++) {
            const entry = this.state.profileEntries[i];
            if (userId !== entry.userId) {// Not myself
                // Calculate similarity for artists
                let artists_union = new Set(topArtists.concat(entry.topArtists)); // union of artists
                // https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
                let artists_intersection = topArtists.filter(value => entry.topArtists.includes(value)); //includes checks if topArtists for those 2 are equal
                let artists_score = artists_intersection.length / artists_union.size; // total same artists / total artists

                // Genres have repeats to get rid of any by making it into a set
                let genres_i = Array.from(new Set(topGenres));
                let genres_j = Array.from(new Set(entry.topGenres));

                // Calculate similarity for genres
                let genres_union = new Set(genres_i.concat(genres_j));
                let genres_intersection = genres_i.filter(value => genres_j.includes(value));
                let genres_score = genres_intersection.length / genres_union.size;

                // Calculate similarity for tracks
                let tracks_union = new Set(topTracks.concat(entry.topTracks));
                let tracks_intersection = topTracks.filter(value => entry.topTracks.includes(value));
                let tracks_score = tracks_intersection.length / tracks_union.size;

                let score = ((artists_score + genres_score + tracks_score) / 3) * 100;

                user_score_matches.push(score);

                // if (user_matches.length == 0 || user_matches[1] < score) {
                //     if (user_matches.length != 0) {
                //         user_matches = [];
                //     }
                //     user_matches.push(users[j]["display_name"]);
                //     user_matches.push(score);
                // }

                //console.log("You are", score.toFixed(2), "% similar to", users[j]["display_name"]);
            }
            else {
                user_score_matches.push(-1);
            }
        }

        const max = Math.max(...user_score_matches);
        const index = user_score_matches.indexOf(max);
        const newEntry = this.state.profileEntries[index];
        console.log("You are", max.toFixed(2), "% similar to", newEntry.displayName);
        return {
            match: newEntry,
            score: max
        };

    }




render()
{
    const result = this.determineMatch();
    return (
        <div className="match-page">
            {header}

            {/* just renders their username */}
            <p>{this.props.location.state.displayName}</p>

            {/* Render match here */}
            <p>You are {result.score}% similar to {result.match.displayName}</p>
            <p>
                <img src={this.props.location.state.profilePicture} alt="Profile" className="center"/>
                <img src={result.match.profilePicture} alt="Other Profile" className="center"/>
            </p>

            <p>
                <button onClick={this.props.logout}>Logout</button>
            </p>
        </div>
    )
}
}

export default MatchPage;