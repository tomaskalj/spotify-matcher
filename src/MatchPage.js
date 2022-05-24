import React from "react";
import {header} from "./spotify";

class MatchPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="match-page">
                {header}

                <p>Hello world</p>
            </div>
        );
    }
}

export default MatchPage;