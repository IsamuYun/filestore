import React from 'react';

import Tesseract from 'tesseract.js';

import '../css/app.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        
    }

    componentDidMount() {
        const { TesseractWorker } = Tesseract;
        
        const worker = new TesseractWorker();

        worker.recognize(
            '/images/chinese-ocr-002.jpg',
            'eng+chi_sim',
            {
                'tessedit_create_pdf': '1',
            }
        )
        .progress((p) => {
            console.log('progress', p);
        })
        .then((result) => {
            console.log(result);
        });
    }

    render() {
        return (
            <div>
                <img id="chinese-img" src="/images/chinese-ocr-002.jpg"></img>
                Test</div>
        );
    }
}

export default App;