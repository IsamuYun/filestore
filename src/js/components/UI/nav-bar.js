import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { faDove, faPencilRuler } from "@fortawesome/free-solid-svg-icons";

import jsPDF from "jspdf";


import "../../../css/app.css";


class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }

    onGeneratePDF = () => {
        let doc = new jsPDF();

        let evidence_list = this.props.evidences;

        for (let i = 0; i < evidence_list.length; i++) {
            doc.text(evidence_list[i].content.toString(), 20, (20 + i * 10));
        }
        

        doc.save("the_first_creation.pdf");

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
                    <button className="button-face" onClick={ this.onGeneratePDF }>
                        <FontAwesomeIcon icon={faAddressCard} /> Generate</button>
                    <button className="button-face">
                        <FontAwesomeIcon icon={faAddressCard} /> Generate2</button>
                </div>
            </div>
        );
    }
}

export default NavBar;