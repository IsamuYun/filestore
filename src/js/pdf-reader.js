import React from "react";

import * as pdfWorker from "pdfjs-dist/build/pdf.worker.entry.js";
import PdfJsLib from "pdfjs-dist";

class PDFReader extends React.Component {

    componentWillMount() {
        PdfJsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
        PdfJsLib.getDocument(this.props.file).then((pdf) => {
            let numPages = pdf.numPages;
            for (let i = 1; i < numPages; i++) {
                pdf.getPage(i).then(function(page) {
                    let scale = 1.5;
                    let viewport = page.getViewport({ scale: scale, });
                    //
                    // Prepare canvas using PDF page dimensions
                    //
                    let canvas = document.getElementById('canvas-' + i);
                    let context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    //
                    // Render PDF page into canvas context
                    //
                    let renderContext = {
                      canvasContext: context,
                      viewport: viewport,
                    };
                    page.render(renderContext);
                });


            }
            
            
        });    
    }

    render() {
        return (
            <div>
                <canvas id="canvas-1" style={{"border": "1px solid black"}}></canvas>
                <canvas id="canvas-2" style={{"border": "1px solid black"}}></canvas>
                <canvas id="canvas-3" style={{"border": "1px solid black"}}></canvas>
                <canvas id="canvas-4" style={{"border": "1px solid black"}}></canvas>
                <canvas id="canvas-5" style={{"border": "1px solid black"}}></canvas>
                <canvas id="canvas-6" style={{"border": "1px solid black"}}></canvas>
                <canvas id="canvas-7" style={{"border": "1px solid black"}}></canvas>
                <canvas id="canvas-8" style={{"border": "1px solid black"}}></canvas>
            </div>
        );
    }
}

export default PDFReader;