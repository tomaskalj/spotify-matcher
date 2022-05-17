import {header} from "./spotify";

function TestPage(props) {
    return (
        <div className="test-page">
            {header}

            <h2>You matched with garfieldlover9000!</h2>

            <img src="https://static.wixstatic.com/media/2cd43b_534355ae0b214dfd9fc8918ec1aeb60c~mv2.png/v1/fill/w_256,h_256,q_90/2cd43b_534355ae0b214dfd9fc8918ec1aeb60c~mv2.png"
                 alt="test" className="center"/>

            <p>Your music taste was 85% similar!</p>

            <p>
                <button onClick={props.logout}>Logout</button>
            </p>
        </div>
    )
}

export default TestPage;