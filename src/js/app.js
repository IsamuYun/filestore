import React from "react";

import * as pdfWorker from "pdfjs-dist/build/pdf.worker.entry.js";
import PdfJsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";

import NavBar from "./components/UI/nav-bar";

import "../css/app.css";

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
        console.log(`pageX: ${event.pageX}, clientY: ${event.pageY}`);
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

        console.log(selectedRect);

        let left = Math.floor(selectedRect.left);
        let top = Math.floor(selectedRect.top);
        let height = Math.floor(selectedRect.height);
        let width = Math.floor(selectedRect.width);
        
        this.evidence_number += 1;
        
        // 创建一个元素
        let evidence_tag = document.createElement("div");
        evidence_tag.setAttribute("id", "evidence-" + this.evidence_number);
        evidence_tag.setAttribute("class", "evidence-number");
        evidence_tag.style["left"] = left + "px";
        evidence_tag.style["top"] = top + "px";
        evidence_tag.style["height"] = height + "px";
        evidence_tag.style["width"] = width + "px";
        evidence_tag.innerText = this.evidence_number;
        
        let root = document.getElementById("app");
        root.appendChild(evidence_tag);

        evidence_tag.addEventListener("mousedown", (target_id) => {this.onSelectEvidence(evidence_tag.id)});
        
        
        document.execCommand("copy");
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
        let container = document.getElementById("viewContainer");
        let viewer = document.getElementById("viewer");

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

    render() {
        return (
            <div className="main-page flex-column">
                <NavBar />
                <div className="main-container">
                    <div className="pdf-view-container">
                        <div id="viewContainer" ref={this.viewerContainer}>
                            <div id="viewer" ref={this.viewer} className="pdfViewer" 
                                onMouseDown={this.onMouseDown} 
                                onMouseUp={this.onMouseUp}
                            />    
                        </div>
                    </div>
                    <div className="control-container">

                    </div>
                </div>
                
            </div>
        );
    }
}

export default App;