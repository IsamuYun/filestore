import React from "react";

import * as pdfWorker from "pdfjs-dist/build/pdf.worker.entry.js";
import PdfJsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";

import NavBar from "./components/UI/nav-bar";
import EvidenceList from "./components/UI/evidence-list";

import "../css/app.css";

const NOW = new Date();

const Evidences = [
    { create_time: new Date(), content: "ABCDEFG" },
    { create_time: new Date(2019, 5, 28), content: "JKLMN" },
    { create_time: new Date(1979, 5, 8, 19), content: "Birthday"}
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.mouse_down_x = 0;
        this.mouse_down_y = 0;
        this.mouse_up_x = 0;
        this.mouse_up_y = 0;
        this.evidence_number_x = 0;
        this.evidence_number_y = 0;
        this.evidence_number = 0;
        this.select_id = "";

        this.state = {
            is_selection_begin: false,
            evidence_list: Evidences
        }
        
        

    }


    
    onNextPageClick = () => {
        if(this.state.numPages > this.state.pageNumber) {
            this.setState({pageNumber: this.state.pageNumber + 1});
            this.setState({pageNumberInput: this.state.pageNumber + 1});
    
            this.pdfViewer.currentPageNumber++;
        }
    }

    onPreviousPageClick = () => {
        if(this.state.pageNumber > 1) {
            this.setState({pageNumber: this.state.pageNumber - 1});
            this.setState({pageNumberInput: this.state.pageNumber - 1});
    
            this.pdfViewer.currentPageNumber--;
        }
    }

    onMouseDown = (event) => {
        console.log(`pageX: ${event.pageX}, pageY: ${event.pageY}`);
        this.mouse_down_x = event.pageX;
        this.mouse_down_y = event.pageY;

    }
    
    onCopy = (event) => {
        console.log(event.clipboardData.getData("Text"));
    }

    onMouseUp = (event) => {
        this.mouse_up_x = event.pageX;
        this.mouse_up_y = event.pageY;
        
        console.log(`pageX: ${event.pageX}, pageY: ${event.pageY}`);

        let selectedText = window.getSelection();
        
        let selectedRange = selectedText.getRangeAt(0);

        let selectedRect = selectedRange.getBoundingClientRect();

        
        let left = Math.floor(selectedRect.left);
        let top = Math.floor(selectedRect.top);
        let height = Math.floor(selectedRect.height);
        let width = Math.floor(selectedRect.width) + 10;
        
        
        this.evidence_number += 1;

        if (top > 0) {
            let line_gap = top % 25;
            top = top - line_gap;
            height = height + line_gap;
        }



        
        // 创建一个元素
        let evidence_tag = document.createElement("div");
        evidence_tag.setAttribute("id", "evidence-" + this.evidence_number);
        evidence_tag.setAttribute("class", "evidence-number");
        evidence_tag.style["left"] = left + "px";
        evidence_tag.style["top"] = this.mouse_down_y + "px";
        evidence_tag.style["height"] = height + "px";
        evidence_tag.style["width"] = width + "px";
        evidence_tag.innerText = this.evidence_number;
        
        let root = document.getElementById("app");
        root.appendChild(evidence_tag);

        evidence_tag.addEventListener("mousedown", (target_id) => {this.onSelectEvidence(evidence_tag.id)});
        
        
        document.execCommand("copy");

        let evidence = { create_time: new Date(), content: selectedText };
        this.state.evidence_list.push(evidence);
        this.setState({evidences_list: this.state.evidence_list});
    }

    onSelectEvidence = (target) => {
        this.select_id = target;
        console.log(this.select_id);
    }

    onDeleteEvidence = (event) => {
        console.log(`Remove id: ${this.select_id}`);

        if (event.keyCode === 8) {
            let elem = document.getElementById(this.select_id);
            if (elem !== null) {
                elem.parentNode.removeChild(elem);
            }
        }
    }


    componentDidMount() {
        let container = document.getElementById("pdf-view-container");
        let viewer = document.getElementById("pdf-viewer");

        PdfJsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

        let loadingTask = PdfJsLib.getDocument(this.props.file);
        
        loadingTask.promise.then((pdf) => {
            this.setState({ numPages: pdf.numPages });
            
            this.pdfLinkService = new pdfjsViewer.PDFLinkService();
            this.pdfFindController = new pdfjsViewer.PDFFindController({
                linkService: this.pdfLinkService
            });

            this.pdfViewer = new pdfjsViewer.PDFViewer({
                container,
                viewer,
                linkService: this.pdfLinkService,
                findController: this.pdfFindController
            });
            this.pdfLinkService.setViewer(this.pdfViewer);
            this.pdfViewer.setDocument(pdf);
            this.pdfLinkService.setDocument(pdf, null);

            this.pdfViewer.onePageRendered.then(() => {
                pdf.getOutline().then((outline) => {
                    this.outline = outline || null;
                    if (!outline) {
                        return;
                    }
                    this.setState({bookmarkItems: outline});
                });
            });

            
        })

        document.addEventListener("keydown", (event) => {this.onDeleteEvidence(event)});
    }

    // 标记selection开始
    selectionBegin = () => {
        this.setState({is_selection_begin: true});
        let viewer = document.getElementById("pdf-viewer");
        if (viewer !== null) {
            viewer.style["cursor"] = "crosshair";
        }
        
    }

    onChangeDateTime = (date) => { this.setState({date})};

    render() {
        return (
            <div className="main-page flex-column">
                <NavBar selectionStart={ this.selectionBegin }/>
                <div className="main-container flex-row">
                    <div className="pdf-view-container">
                        <div id="pdf-view-container">
                        <div id="pdf-viewer" className="pdfViewer" 
                            onMouseDown={this.onMouseDown} 
                            onMouseUp={this.onMouseUp}
                        />
                        </div>
                    </div>
                    <div className="control-container flex-column">
                        <EvidenceList evidences={this.state.evidence_list} />
                    </div>
                </div>
                
            </div>
        );
    }
}

export default App;