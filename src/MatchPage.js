import "./MatchPage.css";
import React from "react";
import {header} from "./spotify";
import {useLocation} from "react-router-dom";
import ProfileEntryService from "./services/profile_entry.service";
import animationData from "./4603-heart-beat-icon.json"; // here
import Lottie from "react-lottie-segments";

function MatchPage(props) {
    const location = useLocation();
    const logout = () => props.navigate("/");

    return <MatchPageWrapper {...props} location={location} logout={logout}/>
}

class MatchPageWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileEntries: [],
            sequence: {
                segments: [0, 1],
                forceFlag: true
            },
            called: false
        };
    }

    componentDidMount() {
        this.retrieveEntries();
    }

    componentDidUpdate() {
        const final = this.determineMatch();
        console.log('score' + final.score)
        let start = 0;
        let percent = 60 / 100;
        let stop = Math.ceil(percent * 15.5);
        console.log(stop)
        if (stop < 0) {
            stop = 1;
        }
        if(!this.state.called){
            this.setState({
                sequence: {
                    segments: [start, stop],
                    forceFlag: true
                }
        });
        this.setState({
            called: true
        })
    }
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
        const options = {
            loop: false, // here
            autoplay: false, // & here
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid slice"
            }
        }
        // let percent = result.score / 100;
        // let stop = percent * 240;
        // if (stop < 0) {
        //     stop = 10;
        // }
        // this.setState({
        //     sequence: {
        //         segments: [start, stop],
        //         forceFlag: true
        //     }
        // });


        if (result.match) {
            return (
                <div className="match-page-loaded">
                    <div className="match-page-header">
                        <div style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        top: "0%",
                    }}>
                            {header}
                        </div>

                        <h2 style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        top: "15%",
                    }}>Your music taste is {Math.round(result.score)}% similar
                            to {result.match.display_name}'s</h2>
                    </div>
                    <div style={{
                        position: "absolute",
                        marginLeft: "15%",
                        marginRight: "15%",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        top: "5%",
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "stretch",
                            padding: "5px"
                        }}>
                            <img src={this.props.location.state.profilePicture} alt="Profile" className="left"/>
                            <Lottie
                                options={options}
                                height={300}
                                width={300}
                                isClickToPauseDisabled={true} // here
                                playSegments={this.state.sequence} // & here
                                speed={.2}
                            />
                            <img src={result.match.image_url} alt="Other Profile" className="right"/>
                        </div>
                    </div>

                    <p style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        top: "470px"
                    }}>
                        <span onClick={this.props.logout} style={{
                            cursor: "pointer",
                            display: "inline-block",
                            overflow: "hidden",
                            width: "150"
                        }}>Logout</span>
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