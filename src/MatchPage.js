import React from "react";
import {header} from "./spotify";
import {useLocation} from "react-router-dom";

function MatchPage() {
    const {location} = useLocation();
    console.log(location);

    return (
        <div className="match-page">
            {header}

            <p>Hello world</p>
            {/*<p>{location.test}</p>*/}

            <p>
                {/*<button onClick={location.logout}>Logout</button>*/}
            </p>
        </div>
    );
}

export default MatchPage;