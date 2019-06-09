import React from "react";

import timelineData from "../data/timeline-data.json";

import "../css/timeline.css";

const TimelineItem = ({ data }) => (
    <div className="timeline-item">
        <div className="timeline-item-content">
            <span className="tag" style={{ background: data.category.color }}>
                {data.category.tag}
            </span>
            <time>{data.date}</time>
            <p>{data.text}</p>
            {data.link && (
                <a
                    href={data.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {data.link.text}
                </a>
            )}
            <span className="circle" />
        </div>
    </div>
);


class TimeLine extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <div className="timeline-container">
                {
                    timelineData.map((data, idx) => (
                        <TimelineItem data={data} key={idx} />
                    ))
                }
            </div>
            
        );
    }

}



