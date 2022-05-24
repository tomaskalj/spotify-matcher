import React from "react";
import {header} from "./spotify";
import {useLocation} from "react-router-dom";

function MatchPage(props) {
    const location = useLocation();
    const logout = () => props.navigate("/");

    return <MatchPageWrapper {...props} location={location} logout={logout}/>
}

class MatchPageWrapper extends React.Component {
    constructor(props) {
        super(props);
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

    render() {
        return (
            <div className="match-page">
                {header}

                <p>{this.props.location.state.displayName}</p>

                <p>
                    <button onClick={this.props.logout}>Logout</button>
                </p>
            </div>
        )
    }
}

export default MatchPage;