import "./MatchPage.css";
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
            // console.log(response.data);
            this.setState({
                profileEntries: response.data
            },
            //     () => {
            //     console.log(this.determineMatch());
            // }
            );
        });
    }

    // getFrequencyMap(genres) {
    //     let genreObj = {};
    //     genres.forEach(genre => {
    //         if (genreObj[genre]) {
    //             const freq = genreObj[genre];
    //             genreObj[genre] = freq + 1;
    //         } else {
    //             genreObj[genre] = 1;
    //         }
    //     });
    //     let entries = Object.entries(genreObj);
    //     return entries.sort((a, b) => b[1] - a[1]);
    // }

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
        // const topGenresFreqMap = this.getFrequencyMap(topGenres);
        // Your top tracks
        const topTracks = this.props.location.state.topTracks;

        // Similarly, you can get your userId, displayName, profilePicture by doing
        // this.props.location.state.{field}

        const userId = this.props.location.state.userId;

        // console.log("userId: ", userId);

        let user_score_matches = [];

        // console.log("profileEntries: ", this.state.profileEntries);

        for (let i = 0; i < this.state.profileEntries.length; i++) {
            const entry = this.state.profileEntries[i];

            // Not myself
            if (userId !== entry.user_id) {
                // console.log("userIds are not equal");

                // Calculate similarity for artists
                let artists_union = new Set(topArtists.concat(entry.top_artists)); // union of artists
                // https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
                let artists_intersection = topArtists.filter(value => entry.top_artists.includes(value)); //includes checks if topArtists for those 2 are equal
                let artists_score = artists_intersection.length / artists_union.size; // total same artists / total artists

                // Genres have repeats to get rid of any by making it into a set
                let genres_i = Array.from(new Set(topGenres));
                let genres_j = Array.from(new Set(entry.top_genres));

                // Calculate similarity for genres
                let genres_union = new Set(genres_i.concat(genres_j));
                let genres_intersection = genres_i.filter(value => genres_j.includes(value));
                let genres_score = genres_intersection.length / genres_union.size;

                // Calculate similarity for tracks
                let tracks_union = new Set(topTracks.concat(entry.top_tracks));
                let tracks_intersection = topTracks.filter(value => entry.top_tracks.includes(value));
                let tracks_score = tracks_intersection.length / tracks_union.size;

                let score = ((artists_score + genres_score + tracks_score) / 3) * 100;

                user_score_matches.push(score);
            } else {
                // console.log("userIds are the same");

                user_score_matches.push(-1);
            }
        }

        // console.log("user_score_matches: ", user_score_matches);

        const max = Math.max(...user_score_matches);
        const index = user_score_matches.indexOf(max);
        const newEntry = this.state.profileEntries[index];

        // console.log("You are", max.toFixed(2), "% similar to", newEntry.displayName);

        return {
            match: newEntry,
            score: max
        };
    }


    render() {
        const result = this.determineMatch();

        if (result.match) {
            return (
                <div className="match-page-loaded">
                    {header}

                    {/* Render match here */}
                    <p>You are {Math.round(result.score)}% similar to {result.match.display_name}</p>
                    <p>
                        <img src={this.props.location.state.profilePicture} alt="Profile" className="left"/>
                        <img src={result.match.image_url} alt="Other Profile" className="right"/>
                    </p>

                    <p>
                        <button onClick={this.props.logout}>Logout</button>
                    </p>
                </div>
            );
        }

        return (
            <div className="match-page-loading">
                <p>Loading...</p>
            </div>
        );
    }
}

export default MatchPage;