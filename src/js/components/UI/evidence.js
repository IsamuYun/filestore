import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCalendarAlt, faEdit } from "@fortawesome/free-regular-svg-icons";

import { faHighlighter } from "@fortawesome/free-solid-svg-icons";

import DateTimePicker from "react-datetime-picker";

class Evidence extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            create_time: this.props.time,
            content: this.props.content,
            rect_top: 0,
            rect_left: 0,
            rect_width: 0,
            rect_height: 0,
            id: 0,
            key_words: []

        }
    }

    onChangeCreateTime = (date) => {
        this.setState({create_time: date});

    };

    componentDidUpdate() {
        console.log(this.state.create_time);
    }

    render() {
        return (
            <div className="evidence-info">
                <div className="title">Evidence - { this.state.id }</div>
                <div className="datetime-line">
                    <FontAwesomeIcon icon={faCalendarAlt} className="datetime-icon" />
                    <DateTimePicker className="calendar"
                        onChange = { this.onChangeCreateTime }
                        value = { this.state.create_time }
                    />
                </div>
                <div className="text-area flex-row">
                    <FontAwesomeIcon icon={ faEdit } className="text-icon" />
                    <textarea className="text-content" value={this.state.content}>
                    </textarea>
                </div>
                <div className="keyword-line flex-row">
                    <FontAwesomeIcon icon={ faHighlighter } className="keyword-icon" />
                    <input className="keyword-input" value="keyword"></input>
                </div>
                <div className="bubble-line"></div>
                <div className="rect-info"></div>
                <div className="command-line">
                    <button className="save-btn">Save</button>
                    <button className="del-btn">Del</button>
                </div>
            </div>
        );
    }
}

export default Evidence;