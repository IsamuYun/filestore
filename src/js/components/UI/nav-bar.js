import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { faDove, faPencilRuler } from "@fortawesome/free-solid-svg-icons";


import "../../../css/app.css";


class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="flex-row nav-bar">
                <div className="nav-left-bar">
                    <FontAwesomeIcon icon={faDove} /> 当前位置 | 文件A
                </div>
                <div className="nav-right-bar">
                    <button className="button-face" onClick={ this.props.selectionStart }>
                        <FontAwesomeIcon icon={faPencilRuler} /> Selection
                    </button>
                    <button className="button-face">
                        <FontAwesomeIcon icon={faAddressCard} /> Generate1</button>
                    <button className="button-face">
                        <FontAwesomeIcon icon={faAddressCard} /> Generate2</button>
                </div>
            </div>
        );
    }
}

export default NavBar;