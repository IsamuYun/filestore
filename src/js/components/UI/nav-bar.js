import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTwitter } from "@fortawesome/free-brands-svg-icons";


import "../../../css/app.css";


class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="flex-row nav-bar">
                <div className="nav-left-bar">
                    <FontAwesomeIcon icon={faTwitter} />
                </div>
                <div className="nav-right-bar">

                </div>
            </div>
        );
    }
}

export default NavBar;