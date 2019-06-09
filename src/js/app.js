import React from "react";

import * as pdfWorker from "pdfjs-dist/build/pdf.worker.entry.js";
import PdfJsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";


class App extends React.Component {
    constructor(props) {
        super(props);
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
    

    componentDidMount() {
        let container = document.getElementById("viewContainer");
        let viewer = document.getElementById("viewer");

        PdfJsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
        PdfJsLib.getDocument(this.props.file).then((pdf) => {
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
    }

    render() {
        return (
            <div>
            <div className="splitToolbarButton hiddenSmallView">
                <button className="toolbarButton pageUp" 
                    title="Previous Page" 
                    id="previous" 
                    tabIndex="13" data-l10n-id="previous" onClick={this.onPreviousPageClick}>
                    <span data-l10n-id="previous_label">Previous</span>
                </button>
                <div className="splitToolbarButtonSeparator" />
                <button className="toolbarButton pageDown" 
                    title="Next Page" 
                    id="next" 
                    tabIndex="14" data-l10n-id="next" onClick={this.onNextPageClick}>
                    <span data-l10n-id="next_label">Next</span>
                </button>
            </div>
            <div id="viewContainer" ref={this.viewerContainer}>
                <div id="viewer" ref={this.viewer} className="pdfViewer" />    
            </div>
            </div>
        );
    }
}

export default App;