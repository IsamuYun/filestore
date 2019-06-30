import React from "react";

import Evidence from "./evidence";

function EvidenceList(props) {
    return (
        <div>
            {props.evidences.map((evi) => <Evidence time={evi.create_time} content={evi.content} />)}
        </div>
    );
}

export default EvidenceList;