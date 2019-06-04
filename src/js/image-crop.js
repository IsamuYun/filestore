import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import "../css/app.css";

import Tesseract from "tesseract.js";

class ImageCropper extends React.Component {
    
        
    constructor(props) {
        super(props);
        
        this.state = {
            src: null,
            crop: {
                width: 200,
                x: 0,
                y: 0
            }
        };
    }

    onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                this.setState({ src: reader.result });
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    onImageLoaded = (image, crop) => {
        this.imageRef = image;
    };

    onCropComplete = (crop) => {
        this.makeClientCrop(crop);
    }

    onCropChange = (crop) => {
        this.setState({ crop });
    }

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                "newFile.jpeg"
            );
            this.setState({ croppedImageUrl });
            
            const { TesseractWorker } = Tesseract;
        
            const worker = new TesseractWorker();
                
            const canvas = document.getElementById("crop-editor");
            worker.recognize(
                canvas,
                'eng+chi_sim'
            )
            .progress((p) => {
                console.log('progress', p);
            })
            .then((result) => {
                console.log(result);

                let content_box = document.getElementById("extaction-content");
                content_box.value = result.text;
            });


        }
    }

    getCroppedImg(image, crop, filename) {
        const canvas = document.getElementById("crop-editor");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
      
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
              if (!blob) {
                console.error("Canvas is empty");
                return;
              }
              blob.name = filename;
              window.URL.revokeObjectURL(this.fileUrl);
              this.fileUrl = window.URL.createObjectURL(blob);
              resolve(this.fileUrl);
            }, "image/jpeg");
        });
    }

    render() {
        const { crop, croppedImageUrl, src } = this.state;
    
        return (
            <div className="main-box flex-row">
                <div className="left-box">
                { 
                    src && (
                        <ReactCrop
                            src={src}
                            crop={crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        />
                    )
                }
                </div>
                <div className="right-box">
                    <div>
                        <input 
                            className="inputfile" 
                            type="file"
                            onChange={this.onSelectFile}
                            name="upload-image"
                            id="upload-image"
                        />
                        <label className="img-upload" htmlFor="upload-image">Choose a file</label>
                    </div>
                    <div>
                        <label className="label-title">截取图片</label>
                    </div>
                    <div className="crop-box">
                        <canvas id="crop-editor" ></canvas>
                    </div>
                    <div>
                        <label className="label-title">文字内容</label>
                    </div>
                    <div className="content-box">
                        <textarea id="extaction-content" className="content-area" placeholder="ABCDEFG"></textarea>
                    </div>
                    <div>
                        <label className="label-title">关键字</label>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageCropper;

